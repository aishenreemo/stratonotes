import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import Editor from "./components/Editor";
import NoteToolbar from "./components/NoteToolbar";
import Searchbar from "./components/Searchbar";
import FileList from "./components/FileList";
import AIPrompt from "./components/AIPrompt";
import Window from "./components/Window";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useWindows } from "./contexts/WindowsContext";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Note, useExplorer } from "./contexts/ExplorerContext";
import { error } from "@tauri-apps/plugin-log";

/**
 * App Component
 *
 * @component
 * @description The main application component that orchestrates the layout and rendering of all
 * primary UI components. It sets up a grid-based layout for the application, integrating
 * the header, ribbons, sidebars (left and potentially right), the main editor area,
 * and the footer. It also includes a `ToastContainer` for displaying notifications.
 *
 * @returns {React.ReactNode} The root `div` element containing the entire application UI.
 */
function App(): React.ReactNode {
    let windows = useWindows();
    let explorer = useExplorer();

    useEffect(() => {
        (async function () {
            try {
                let title = await invoke("report");
                let files = (await invoke("fetch_notes")) as Note[];

                explorer.dispatch({
                    type: "FETCH_NOTES",
                    payload: files as Note[],
                });

                explorer.dispatch({
                    type: "OPEN_NOTE",
                    payload: files.findIndex((f) => f.title == title),
                });
                toast("Created a report.", {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    className: "shadow-lg rounded-lg",
                });
            } catch (err) {
                error(`${err}`);
            }
        })();
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden">
            {/* ToastContainer for displaying notifications throughout the app */}
            <ToastContainer />
            <Window
                width="80%"
                height="80%"
                className={windows.state.isOpened[2] ? "block" : "hidden"}
            ></Window>

            {/* Cloud animation background */}
            <div className="clouds-container">
                <div
                    className="cloud dark:hidden"
                    style={{ top: "20%", animationDuration: "35s" }}
                ></div>
                <div
                    className="cloud dark:hidden"
                    style={{
                        top: "40%",
                        animationDuration: "45s",
                        animationDelay: "5s",
                    }}
                ></div>
                <div
                    className="cloud dark:hidden"
                    style={{
                        top: "60%",
                        animationDuration: "40s",
                        animationDelay: "10s",
                    }}
                ></div>

                {/* Decorative clouds in lower left and lower right */}
                <img
                    src="/assets/images/decorative_clouds.png"
                    alt=""
                    className="fixed left-0 bottom-0
                        w-full
                        h-auto
                        dark:hidden
                        pointer-events-none
                        z-[-1]
                        transition-all duration-300
                        object-cover"
                />
            </div>

            {/* Main application grid layout */}
            <div
                style={{
                    // Defines the grid columns: auto for ribbons, auto for left sidebar,
                    // 1fr for the main editor content, and auto for the right sidebar (if present)
                    gridTemplateColumns: "auto auto 1fr auto",
                    // Defines the grid rows: auto for header, 1fr for main content area, auto for footer
                    gridTemplateRows: "auto 1fr auto",
                }}
                className={[
                    "w-full h-full rounded-sm max-w-screen max-h-screen",
                    "grid", // Enables CSS Grid
                    "overflow-hidden", // Prevents overflow issues within the grid container
                ].join(" ")}
            >
                {/* Header spanning across all grid columns */}
                <Header />

                {/* Ribbons component in the first grid column */}
                <Ribbons />

                {/* Left Sidebar containing search, AI prompt, note toolbar, and file list */}
                <Sidebar anchor="LEFT">
                    <Searchbar />
                    <AIPrompt />
                    <NoteToolbar />
                    <FileList />
                </Sidebar>

                {/* Main Editor component */}
                <Editor />

                {/*
        // Example of a Right Sidebar (currently commented out)
        <Sidebar anchor="RIGHT">
          <Calendar
            className={[
              "m-1 p-2 border overflow-hidden h-auto",
              "[&>:first-child]:flex [&>div:first-child]justify-center",
              "[&>:last-child]:text-[0.75rem]",
            ].join(" ")}
          />
        </Sidebar>
        */}

                {/* Footer spanning across all grid columns */}
                <Footer />
            </div>
        </div>
    );
}

export default App;
