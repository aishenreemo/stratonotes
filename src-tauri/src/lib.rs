use std::env;
use std::error::Error;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use std::path::PathBuf;

use log::info;
use settings::PathSettings;
use tauri::command;
use tauri::App;
use tauri::Manager;
use tauri::Runtime;
use tauri::State;
use tauri_plugin_log::Builder;

mod settings;

pub type Result<T> = std::result::Result<T, Box<dyn Error>>;

fn setup_app<R: Runtime>(app: &mut App<R>) -> Result<()> {
    let path_settings = PathSettings::default();
    if !path_settings.exists_all() {
        info!("Some directories are missing, re-creating folders.",);
        path_settings.create_dirs()?;
    }

    app.manage(path_settings);

    Ok(())
}

#[command]
fn fetch_notes(path_settings: State<'_, PathSettings>) -> std::result::Result<Vec<PathBuf>, String> {
    if !path_settings.notes.is_dir() {
        return Err(format!("Path '{:?}' is not a directory.", path_settings.notes).into());
    }

    let entries = fs::read_dir(&path_settings.notes)
        .map_err(|e| format!("{e:?}"))?
        .filter(|e| e.is_ok())
        .map(|e| e.unwrap())
        .filter(|e| e.path().is_file())
        .filter(|e| {
            e.path()
                .extension()
                .map_or(false, |x| x.to_string_lossy().to_lowercase() == "md")
        })
        .map(|e| e.path())
        .collect();

    Ok(entries)
}

#[command]
fn open_note(file_path: String) -> std::result::Result<String, String> {
    fs::read_to_string(file_path).map_err(|e| e.to_string())
}

#[command]
fn save_note(file_path: String, note_content: String) -> std::result::Result<(), String>{
    let file_name: &OsStr = Path::new(&file_path).file_name().unwrap();
    if !PathBuf::from(&file_path).exists() {
        return Err(format!("{file_name:?} does not exist.").into())
    }
    fs::write(file_path, note_content).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn delete_note(file_path: String) -> std::result::Result<(), String>{
    let file_name: &OsStr = Path::new(&file_path).file_name().unwrap();
    if !PathBuf::from(&file_path).exists() {
        return Err(format!("{file_name:?} does not exist.").into())
    }
    fs::remove_file(file_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn close_app() {
    std::process::exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(setup_app)
        .plugin(Builder::default().level(log::LevelFilter::Info).build())
        .invoke_handler(tauri::generate_handler![fetch_notes, open_note, save_note, delete_note, close_app])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
