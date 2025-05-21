// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// This attribute ensures that a console window does not pop up when the
// application is run in release mode on Windows, providing a cleaner user experience.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/// The main entry point of the Tauri application.
///
/// This function is the first code executed when the application starts.
/// It simply calls the `run` function from the `app_lib` module,
/// which contains the core setup and execution logic for the Tauri backend.
fn main() {
    app_lib::run();
}
