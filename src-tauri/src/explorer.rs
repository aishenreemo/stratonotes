use std::ffi::OsStr;
use std::fs;
use std::fs::File;
use std::path::Path;
use std::path::PathBuf;

use log::info;
use tauri::command;
use tauri::State;

use crate::settings::PathSettings;

#[command]
pub fn fetch_notes(path_settings: State<'_, PathSettings>) -> std::result::Result<Vec<PathBuf>, String> {
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
pub fn open_note(file_path: String) -> std::result::Result<String, String> {
    fs::read_to_string(file_path).map_err(|e| e.to_string())
}

#[command]
pub fn save_note(file_path: String, note_content: String) -> std::result::Result<(), String> {
    if !PathBuf::from(&file_path).exists() {
        let file_name: &OsStr = Path::new(&file_path).file_name().unwrap();
        return Err(format!("{file_name:?} does not exist.").into());
    }
    fs::write(file_path, note_content).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_note(file_path: String) -> std::result::Result<(), String> {
    let file_name: &OsStr = Path::new(&file_path).file_name().unwrap();
    if !PathBuf::from(&file_path).exists() {
        return Err(format!("{file_name:?} does not exist.").into());
    }
    fs::remove_file(file_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn create_note(
    path_settings: State<'_, PathSettings>,
    title: String,
    content: Option<String>,
) -> std::result::Result<String, String> {
    let mut modifiable_title: String = title.clone();
    let mut counter: i32 = 0;
    let mut file: PathBuf = PathBuf::from(path_settings.notes.join(format!("{modifiable_title}.md")));

    while PathBuf::from(&file).exists() {
        counter += 1;
        modifiable_title = format!("{}-{}", &title, counter);
        file = path_settings.notes.join(format!("{modifiable_title}.md"));
    }

    File::create(&file).map_err(|e| e.to_string())?;
    info!("{content:?}");

    if let Some(note_content) = content {
        fs::write(&file, note_content).map_err(|e| e.to_string())?;
    }

    Ok(file.to_str().unwrap().to_string())
}
