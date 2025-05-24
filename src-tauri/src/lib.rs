use std::env;
use std::error::Error;
use std::fs;
use std::path::PathBuf;

use chrono::DateTime;
use chrono::Datelike;
use chrono::Local;
use chrono::TimeDelta;
use chrono::Weekday;
use dotenv::dotenv;
use log::info;
use rig::completion::Prompt;
use rig::providers::gemini;
use settings::PathSettings;
use tauri::command;
use tauri::App;
use tauri::Manager;
use tauri::Runtime;
use tauri::State;
use tauri_plugin_log::Builder;

mod settings;
mod explorer;

/// @type Result
/// @brief A custom type alias for `std::result::Result` that uses a boxed `dyn Error`
/// for the error type.
///
/// This simplifies error handling by allowing different error types to be
/// returned as a common `Box<dyn Error>`, promoting more flexible error propagation.
pub type Result<T> = std::result::Result<T, Box<dyn Error>>;

/// @function setup_app
/// @brief Initializes the Tauri application backend.
///
/// This function is executed during the application's startup phase. It performs
/// essential setup tasks such as loading environment variables, validating and
/// creating necessary application directories based on `PathSettings`, and
/// making the `PathSettings` available as managed state to other Tauri commands.
///
/// @param app A mutable reference to the `tauri::App` instance, allowing
/// configuration and state management.
/// @tparam R The specific Tauri `Runtime` being used (e.g., `tauri::Wry`).
/// @return Returns `Ok(())` on successful setup or an `Err(Box<dyn Error>)`
/// if any setup step, such as directory creation, fails.
fn setup_app<R: Runtime>(app: &mut App<R>) -> Result<()> {
    // Load environment variables from a .env file into the process's environment.
    // `.ok()` converts the Result into an Option, ignoring potential errors if the file
    // does not exist or cannot be read.
    dotenv().ok();

    // Initialize the PathSettings with default values. These settings define
    // important file system paths for the application, such as where notes are stored.
    let path_settings = PathSettings::default();

    // Check if all required application directories (as defined in PathSettings) exist.
    // If any are missing, log an informational message and attempt to create them.
    if !path_settings.exists_all() {
        info!("Some directories are missing, re-creating folders.");
        // Attempt to create the directories. The `?` operator will propagate any
        // error that occurs during directory creation.
        path_settings.create_dirs()?;
    }

    app.manage(path_settings);

    Ok(())
}

#[command]
async fn report(path_settings: State<'_, PathSettings>) -> std::result::Result<String, String> {
    let today = Local::now();
    let today_formatted = today.format("%Y-%m-%d");
    let summary_name= format!("{}.md", &today_formatted);
    let summary_path= PathBuf::from(&summary_name);
    let summary_note = path_settings.notes.clone().join(&summary_path);

    if today.weekday() == Weekday::Sat && !summary_note.exists() {
        let seven_days_ago = today - TimeDelta::days(7);
        let files = fs::read_dir(&path_settings.notes).map_err(|e| format!("{e:?}"))?;
        let files = files.filter(|f| f.is_ok());
        let files = files.map(|f| f.unwrap().path());
        let mut content = String::new();

        for path in files {
            let metadata = fs::metadata(&path).map_err(|e| format!("{e:?}"))?;
            let created: DateTime<Local> = metadata.created().map_err(|e| format!("{e:?}"))?.into();

            if created < seven_days_ago || created > today {
                continue;
            }

            content.push_str(&fs::read_to_string(&path).map_err(|e| format!("{e:?}"))?);
        }

        let client = gemini::Client::from_env();
        let agent = client
            .agent(gemini::completion::GEMINI_2_0_FLASH)
            .preamble("Summarize and create a report using the text in the prompt. Try to avoid referring to the author or refer to it as The text, be objective as much as possible and just simply state what is in the texts in a more narrative and seamless flow, as well as make it more digestible.")
            .temperature(0.5)
            .build();

        let response = agent.prompt(&content).await.map_err(|e| e.to_string())?;
        let note_content = format!("# Summary {}\n\n{}", &today_formatted, response);
        fs::write(&summary_note, note_content).map_err(|e| e.to_string())?;

        info!("Done creating a report. {summary_note:?}");
        return Ok(format!("Summary {}", &today_formatted));
    }

    Err("No report for today.".into())
}

/// @command close_app
/// @brief Tauri command to terminate the application process.
///
/// This command is exposed to the frontend (via `tauri::generate_handler!`)
/// allowing the user interface to trigger a full shutdown of the Tauri application.
/// It exits the process with a success status code.
#[command]
fn close_app() {
    // Exit the current process immediately with a success status code (0).
    std::process::exit(0);
}

/// @command prompt
/// @brief Tauri command to interact with the Gemini AI model.
///
/// This asynchronous command connects to the Gemini AI service, configures
/// an AI agent with a given `preamble` and a specific `temperature`, and then
/// sends a `prompt` to the AI. It uses the `rig` crate for AI integration.
///
/// @param preamble A `String` containing the initial context or instructions
/// that guide the AI's behavior before processing the main prompt.
/// @param prompt A `String` representing the actual query or request sent to the AI.
/// @return Returns a `Result` containing the AI's response as a `String` on success.
/// On failure, it returns a `String` error message, which could be due to API issues,
/// network errors, or incorrect configuration.
#[command]
async fn prompt(preamble: String, prompt: String) -> std::result::Result<String, String> {
    // Create a Gemini AI client instance. It typically reads API keys from
    // environment variables (e.g., GEMINI_API_KEY).
    let client = gemini::Client::from_env();
    // Configure the AI agent: specify the model (GEMINI_2_0_FLASH),
    // set the preamble for context, and set the temperature for response randomness.
    let agent = client
        .agent(gemini::completion::GEMINI_2_0_FLASH)
        .preamble(&preamble)
        .temperature(0.5) // A temperature of 0.5 balances creativity and determinism.
        .build();

    // Send the prompt to the AI agent and await its response.
    let response = agent.prompt(prompt).await;
    // Map any error from the `rig` crate (which typically uses `Box<dyn Error>`)
    // into a `String` error that can be sent back to the frontend.
    response.map_err(|e| e.to_string())
}

/// @function run
/// @brief The main entry point for the Tauri application.
///
/// This function sets up and launches the Tauri application. It configures
/// various aspects of the application, including:
/// - A `setup` hook (`setup_app`) that runs on initialization.
/// - A logging plugin for backend console output.
/// - The `invoke_handler` which registers all Rust functions exposed as Tauri commands
///   to the frontend.
/// It then starts the Tauri runtime.
///
/// @cfg_attr mobile, tauri::mobile_entry_point
/// This attribute macro ensures that the `run` function is designated as the
/// entry point when compiling the application for mobile platforms.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Register the `setup_app` function to be called once Tauri initializes.
        .setup(setup_app)
        // Integrate the Tauri logging plugin, configured to output messages
        // with an `Info` level or higher.
        .plugin(Builder::default().level(log::LevelFilter::Info).build())
        // Register all the Rust functions that can be invoked from the frontend.
        // `tauri::generate_handler!` automatically creates the necessary glue code.
        .invoke_handler(tauri::generate_handler![
            prompt,               // Command for AI interaction.
            explorer::fetch_notes, // Command to retrieve all notes.
            explorer::open_note,  // Command to read content of a specific note.
            explorer::save_note,  // Command to save content to a specific note.
            explorer::delete_note, // Command to delete a specific note.
            explorer::create_note, // Command to create a new note.
            close_app,            // Command to close the application.
            report,
        ])
        // Build and run the Tauri application, passing the generated build context.
        // `.expect()` will cause the application to panic if an unrecoverable error
        // occurs during the Tauri application startup.
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
