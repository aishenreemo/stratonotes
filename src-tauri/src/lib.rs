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
use tauri_plugin_log::Builder;

mod settings;
mod explorer;

pub type Result<T> = std::result::Result<T, Box<dyn Error>>;

fn setup_app<R: Runtime>(app: &mut App<R>) -> Result<()> {
    dotenv().ok();

    let path_settings = PathSettings::default();
    if !path_settings.exists_all() {
        info!("Some directories are missing, re-creating folders.",);
        path_settings.create_dirs()?;
    }

    app.manage(path_settings);

    Ok(())
}

#[command]
fn close_app() {
    std::process::exit(0);
}

#[command]
async fn prompt(preamble: String, prompt: String) -> std::result::Result<String, String> {
    let client = gemini::Client::from_env();
    let agent = client
        .agent(gemini::completion::GEMINI_2_0_FLASH)
        .preamble(&preamble)
        .temperature(0.5)
        .build();

    let response = agent.prompt(prompt).await;
    response.map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup_app)
        .plugin(Builder::default().level(log::LevelFilter::Info).build())
        .invoke_handler(tauri::generate_handler![
            prompt,
            explorer::fetch_notes,
            explorer::open_note,
            explorer::save_note,
            explorer::delete_note,
            explorer::create_note,
            close_app,
            prompt
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
