use std::env;
use std::error::Error;

use dotenv::dotenv;
use log::info;
use rig::completion::Prompt;
use rig::providers::gemini;
use settings::PathSettings;
use tauri::command;
use tauri::App;
use tauri::Manager;
use tauri::Runtime;
use tauri::Theme;
use tauri::Window;
use tauri_plugin_log::Builder;

mod explorer;
mod settings;

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
    // app.handle().set_theme(Some(tauri::Theme::Dark)); // This line is commented out and thus inactive.

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

    // Manage the `path_settings` instance as Tauri application state.
    // This makes `path_settings` accessible to any Tauri command via
    // `tauri::State<'_, PathSettings>`.
    app.manage(path_settings);

    Ok(())
}

#[command]
fn toggle_theme(window: Window) -> tauri::Result<()> {
    let theme = window.theme();
    let next_theme = match theme {
        Ok(Theme::Light) => Theme::Dark,
        Ok(Theme::Dark) => Theme::Light,
        _ => Theme::Light,
    };

    window.set_theme(Some(next_theme))?;
    Ok(())
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
            prompt,                // Command for AI interaction.
            explorer::fetch_notes, // Command to retrieve all notes.
            explorer::open_note,   // Command to read content of a specific note.
            explorer::save_note,   // Command to save content to a specific note.
            explorer::delete_note, // Command to delete a specific note.
            explorer::create_note, // Command to create a new note.
            close_app,             // Command to close the application.
            toggle_theme,
        ])
        // Build and run the Tauri application, passing the generated build context.
        // `.expect()` will cause the application to panic if an unrecoverable error
        // occurs during the Tauri application startup.
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
