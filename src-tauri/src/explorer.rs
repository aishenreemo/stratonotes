use std::ffi::OsStr;
use std::fs;
use std::fs::File;
use std::io::BufRead;
use std::io::BufReader;
use std::path::Path;
use std::path::PathBuf;

use chrono::prelude::*;
use serde::Serialize;
use tauri::command;
use tauri::State;

use crate::settings::PathSettings;

#[derive(Serialize, Debug)]
pub struct Note {
    path: PathBuf,
    title: Option<String>,
    created: DateTime<Utc>,
    updated: DateTime<Utc>,
}

#[command]
pub fn fetch_notes(path_settings: State<'_, PathSettings>) -> std::result::Result<Vec<Note>, String> {
    if !path_settings.notes.is_dir() {
        return Err(format!("Path '{:?}' is not a directory.", path_settings.notes).into());
    }

    let is_markdown = |x: &OsStr| x.to_string_lossy().to_lowercase() == "md";
    let entries = fs::read_dir(&path_settings.notes).map_err(|e| format!("{e:?}"))?;
    let entries = entries.filter(|e| e.is_ok()).map(|e| e.unwrap()).map(|e| e.path());
    let entries = entries.filter(|e| e.extension().map_or(false, is_markdown));
    let mut output = vec![];

    for path in entries {
        let file = File::open(&path).map_err(|e| format!("{e:?}"))?;
        let reader = BufReader::new(file);
        let mut title = None;
        for line in reader.lines().filter_map(Result::ok) {
            let trimmed = line.trim();
            if line.is_empty() {
                continue;
            } else if trimmed.starts_with("# ") {
                title = Some(trimmed[2..].to_string());
                break;
            }
        }

        let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
        let created: DateTime<Utc> = metadata.created().map_err(|e| e.to_string())?.into();
        let updated: DateTime<Utc> = metadata.modified().map_err(|e| e.to_string())?.into();

        output.push(Note {
            path,
            title,
            created,
            updated,
        });
    }

    Ok(output)
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
    if !PathBuf::from(&file_path).exists() {
        let file_name: &OsStr = Path::new(&file_path).file_name().unwrap();
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
) -> std::result::Result<PathBuf, String> {
    let now: DateTime<Local> = Local::now();
    let formatted = format!("{}.md", now.format("%H%M%S-%y%m%d"));
    let file: PathBuf = PathBuf::from(path_settings.notes.join(formatted));

    let note_content = match content {
        Some(c) => format!("# {title}\n\n{c}"),
        None => format!("# {title}"),
    };

    fs::write(&file, note_content).map_err(|e| e.to_string())?;

    Ok(file)
}
