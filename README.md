# READ ME FILE IS STILL WORK IN PROGRESS.

# Welcome to Stratonotes: Your personalized atmosphere for productive growth.
STRATONOTES is a Note application that generates summaries and reports curated from user entries, allows them to monitor and track any progress they made through the overview and summary of how their week went.

## Features: What can Stratonotes do?
- **Automated report generation:** Stratonotes allow you to automatically generate a report of your notes on a given timeframe;
- **Gain additional insights :** Enhance your notes by using the built-in prompt tool.
  

## Setting up Stratonotes
**Prerequisites:** What you need for setting up Stratonotes.
1. [git](https://git-scm.com/downloads/win)
2. [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
3. [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/#windows)

> [!note]
> Keep in mind that these are the installation links for Windows. Stratonotes is a cross-platform applicaiton, however, you may need to configure things yourself if you're in Linux. 

**Setting up:** To start using Stratonotes, simply:
1. Clone the repository:
```git clone https://github.com/aishenreemo/stratonotes```
2. Change directory:
```cd stratonotes```
3. Run ```yarn```
4. Then run ```yarn tauri dev```

# Using Stratonotes

## Note Toolbar


> [!note]
> Make it a habit to save your notes. **This app still has limitations and some features are not yet implemented; keyboard shortcuts are one of them.** Make sure to click the save button on the note toolbar often to prevent loss of data!

## Editing/viewing your notes
The Stratonotes editor has two modes: source mode and markdown mode. Source mode allows you to edit your notes, while markdown mode sets your note as view-only. To switch between modes, simply click the button to the left.

## Renaming notes and naming convention.
To rename your notes, simply add a header on the first line like this:

> \# Your title goes here...

Keep in mind to always add a header tag! Notes with no set title will have its own unique id as its title by default.

# What's in store for Stratonotes?
Stratonotes is still at its early development. OZON\<e> aims to implement the following features in the future:

- **Configuration:** Enable users to be able to create their own plug-ins, providing limited API access for AI Agents.

- **Community based:** Users can curate their digital gardens, share their notes online, share selected notes to be either private or public; and engage in collaborative learning by allowing them to synthesize their own notes to another user’s notes.
