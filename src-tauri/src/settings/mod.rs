use std::env;
use std::fs;
use std::path::PathBuf;

use crate::Result;

pub struct PathSettings {
    pub root: PathBuf,
    pub journal: PathBuf,
    pub notes: PathBuf,
}

impl Default for PathSettings {
    fn default() -> Self {
        let home = if cfg!(target_os = "windows") { "LOCALAPPDATA" } else { "HOME" };
        let home = env::var(home).expect("Cannot find {home} directory.");
        let root = PathBuf::from(&home).join(".stratonotes");
        Self {
            root: root.clone(),
            journal: root.join("journal"),
            notes: root.join("notes"),
        }
    }
}

impl PathSettings {
    pub fn exists_all(&self) -> bool {
        [&self.root, &self.journal, &self.notes].iter().all(|p| p.exists())
    }

    pub fn create_dirs(&self) -> Result<()> {
        fs::create_dir_all(&self.root)?;
        fs::create_dir_all(&self.journal)?;
        fs::create_dir_all(&self.notes)?;
        Ok(())
    }
}
