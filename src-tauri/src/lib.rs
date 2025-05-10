use std::error::Error;

use tauri::App;
use tauri::Runtime;
use tauri_plugin_log::Builder;

type Result<T> = std::result::Result<T, Box<dyn Error>>;

fn setup_app<R: Runtime>(app: &mut App<R>) -> Result<()> {
    if cfg!(debug_assertions) {
        let log_filter_plugin = Builder::default().level(log::LevelFilter::Info).build();

        app.handle().plugin(log_filter_plugin)?;
    }

    Ok(())
}

#[tauri::command]
fn close_app() {
    std::process::exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup_app)
        .invoke_handler(tauri::generate_handler![close_app])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
