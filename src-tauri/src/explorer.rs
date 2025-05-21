//! This module provides Tauri commands for interacting with the file system
//! to manage markdown notes. It includes functionalities for fetching note lists,
//! opening, saving, deleting, and creating new notes.

use std::ffi::OsStr;
use std::fs;
use std::fs::File;
use std::io::BufRead;
use std::io::BufReader;
use std::path::PathBuf;

use chrono::prelude::*;
use serde::Serialize;
use tauri::command;
use tauri::State;

use crate::settings::PathSettings; // Import PathSettings from the crate's settings module

/// Represents a single note's metadata and file path.
///
/// This struct is used to serialize note information for the frontend,
/// providing details like the file path, an optional title extracted from the note's content,
/// and creation/last updated timestamps.
#[derive(Serialize, Debug)]
pub struct Note {
    /// The full path to the note file on the file system.
    pub path: PathBuf,
    /// An optional title extracted from the first H1 heading (`# Title`) in the note's content.
    /// If no H1 heading is found, this will be `None`.
    pub title: Option<String>,
    /// The creation timestamp of the note file in UTC.
    pub created: DateTime<Utc>,
    /// The last modification timestamp of the note file in UTC.
    pub updated: DateTime<Utc>,
}

/// Tauri command to retrieve a list of all markdown notes from the configured notes directory.
///
/// This command reads the directory specified in `PathSettings.notes`,
/// filters for markdown files (`.md` extension), and extracts metadata for each.
/// For each markdown file, it attempts to read the first non-empty line
/// to find an H1 heading (`# Some Title`) to use as the note's display title.
/// It also fetches the creation and modification timestamps of each file.
///
/// # Arguments
///
/// * `path_settings` - A Tauri `State` containing application path configurations,
///   specifically the directory where notes are stored.
///
/// # Returns
///
/// A `Result` containing either a `Vec<Note>` on success, or a `String` error message on failure.
///
/// # Errors
///
/// Returns an error if:
/// - The configured notes path does not exist or is not a directory.
/// - There's an I/O error while reading the directory or individual note files.
/// - File metadata (created/modified timestamps) cannot be retrieved.
#[command]
pub fn fetch_notes(path_settings: State<'_, PathSettings>) -> std::result::Result<Vec<Note>, String> {
    // Check if the configured notes directory exists and is a directory.
    if !path_settings.notes.is_dir() {
        return Err(format!("Path '{:?}' is not a directory.", path_settings.notes).into());
    }

    // Helper closure to check if a file extension is "md" (case-insensitive).
    let is_markdown = |x: &OsStr| x.to_string_lossy().to_lowercase() == "md";

    // Read directory entries, filter out errors, map to paths, and filter for markdown files.
    let entries = fs::read_dir(&path_settings.notes).map_err(|e| format!("{e:?}"))?;
    let entries = entries.filter(|e| e.is_ok()).map(|e| e.unwrap()).map(|e| e.path());
    let entries = entries.filter(|e| e.extension().map_or(false, is_markdown));

    let mut output = vec![];

    // Iterate over the filtered markdown file paths
    for path in entries {
        let file = File::open(&path).map_err(|e| format!("{e:?}"))?;
        let reader = BufReader::new(file);
        let mut title = None;

        // Read lines to find the first H1 heading for the note's title
        for line in reader.lines().filter_map(Result::ok) {
            let trimmed = line.trim();
            if line.is_empty() {
                continue;
            } else if trimmed.starts_with("# ") {
                title = Some(trimmed[2..].to_string()); // Extract title by skipping "# "
                break; // Stop after finding the first H1
            }
        }

        // Get file metadata for creation and modification times
        let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
        let created: DateTime<Utc> = metadata.created().map_err(|e| e.to_string())?.into();
        let updated: DateTime<Utc> = metadata.modified().map_err(|e| e.to_string())?.into();

        // Push the new Note struct to the output vector
        output.push(Note {
            path,
            title,
            created,
            updated,
        });
    }

    Ok(output)
}

/// Tauri command to read and return the content of a specified note file.
///
/// This command takes a file path as input and attempts to read its entire content into a String.
///
/// # Arguments
///
/// * `file_path` - The full path to the note file to be opened.
///
/// # Returns
///
/// A `Result` containing either the `String` content of the file on success,
/// or a `String` error message on failure.
///
/// # Errors
///
/// Returns an error if:
/// - The file cannot be found or accessed.
/// - There's an I/O error during file reading.
#[command]
pub fn open_note(file_path: String) -> std::result::Result<String, String> {
    fs::read_to_string(file_path).map_err(|e| e.to_string())
}

/// Tauri command to write or update the content of a specified note file.
///
/// This command takes a file path and new content as input and writes the content to the file.
/// If the file does not exist, it returns an error. It overwrites existing content.
///
/// # Arguments
///
/// * `file_path` - The full path to the note file to be saved.
/// * `note_content` - The new `String` content to write into the file.
///
/// # Returns
///
/// A `Result` indicating success (`Ok(())`) or a `String` error message on failure.
///
/// # Errors
///
/// Returns an error if:
/// - The specified file path does not exist.
/// - There's an I/O error during file writing.
#[command]
pub fn save_note(file_path: String, note_content: String) -> std::result::Result<(), String> {
    let path_buf = PathBuf::from(&file_path);
    if !path_buf.exists() {
        let file_name: &OsStr = path_buf.file_name().unwrap_or(OsStr::new("unknown file"));
        return Err(format!("{file_name:?} does not exist.").into());
    }
    fs::write(file_path, note_content).map_err(|e| e.to_string())?;
    Ok(())
}

/// Tauri command to delete a specified note file from the file system.
///
/// This command takes a file path as input and attempts to remove the file.
///
/// # Arguments
///
/// * `file_path` - The full path to the note file to be deleted.
///
/// # Returns
///
/// A `Result` indicating success (`Ok(())`) or a `String` error message on failure.
///
/// # Errors
///
/// Returns an error if:
/// - The specified file path does not exist.
/// - The path points to a directory.
/// - There are insufficient permissions to delete the file.
/// - Other I/O errors occur during file removal.
#[command]
pub fn delete_note(file_path: String) -> std::result::Result<(), String> {
    let path_buf = PathBuf::from(&file_path);
    if !path_buf.exists() {
        let file_name: &OsStr = path_buf.file_name().unwrap_or(OsStr::new("unknown file"));
        return Err(format!("{file_name:?} does not exist.").into());
    }
    fs::remove_file(file_path).map_err(|e| e.to_string())?;
    Ok(())
}

/// Tauri command to create a new markdown note file with an optional initial title and content.
///
/// This command generates a unique filename based on the current timestamp
/// (`HHMMSS-YYMMDD.md`), constructs the full path within the configured notes directory,
/// and writes the initial content. The initial content will always include an H1 heading
/// using the provided `title`.
///
/// # Arguments
///
/// * `path_settings` - A Tauri `State` containing application path configurations.
/// * `title` - The initial title for the new note. This will be used as the H1 heading.
/// * `content` - An `Option<String>` for additional content to be included in the note,
///   appended after the title heading. If `None`, only the title heading is written.
///
/// # Returns
///
/// A `Result` containing the `PathBuf` of the newly created file on success,
/// or a `String` error message on failure.
///
/// # Errors
///
/// Returns an error if:
/// - There's an I/O error during file creation or writing.
#[command]
pub fn create_note(
    path_settings: State<'_, PathSettings>,
    title: String,
    content: Option<String>,
) -> std::result::Result<PathBuf, String> {
    let now: DateTime<Local> = Local::now();
    // Format timestamp for a unique filename (e.g., "123456-250521.md")
    let formatted = format!("{}.md", now.format("%H%M%S-%y%m%d"));
    let file: PathBuf = PathBuf::from(path_settings.notes.join(formatted));

    // Construct the initial content for the new note
    let note_content = match content {
        Some(c) => format!("# {title}\n\n{c}"), // Title as H1, then provided content
        None => format!("# {title}"),          // Only title as H1
    };

    // Write the content to the new file
    fs::write(&file, note_content).map_err(|e| e.to_string())?;

    Ok(file) // Return the path of the created file
}
