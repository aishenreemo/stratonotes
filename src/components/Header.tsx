import { GoSidebarCollapse } from "react-icons/go";
import { IoCloseCircle } from "react-icons/io5";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useExplorer } from "../contexts/ExplorerContext";
import { useWindows } from "../contexts/WindowsContext";

/**
 * Header Component
 *
 * @component
 * @description The header of the application, displaying the application name,
 * the title of the currently selected note, and interactive buttons for
 * collapsing/expanding the sidebar and closing the application. This component
 * also allows for window dragging due to the `data-tauri-drag-region` attribute.
 *
 * @returns {React.ReactNode} A header element containing the application title and control buttons.
 */
function Header(): React.ReactNode {
    const windows = useWindows();
    const explorer = useExplorer();
    const [title, setTitle] = useState("Stratonotes"); // Default application title

    /**
     * Effect hook to update the header title based on the currently selected note.
     * If a note is selected, the title will be "Stratonotes > [Note Title]".
     * If no note is selected, it defaults back to "Stratonotes".
     */
    useEffect(() => {
        const file = explorer.state.selectedFile;
        if (file === undefined) {
            setTitle("Stratonotes");
            return;
        }

        // Determine the base name of the file (either its title or derived from its path)
        const basename =
            file.title || file.path.replace(/\\/g, "/").split("/").pop();
        setTitle(`Stratonotes > ${basename}`);
    }, [explorer.state.selectedFile]); // Re-run effect when the selected file changes

    return (
        <div
            data-tauri-drag-region // Enables window dragging
            className="flex border-b-2 border-white/30 p-1 gap-1 text-shadow-lg"
            style={{
                gridColumn: "1 / 5", // Spans across all columns in a grid layout
            }}
        >
            <div className="flex items-center">
                {/* Button to toggle the left sidebar's open state */}
                <button
                    onClick={() =>
                        windows.dispatch({
                            type: "TOGGLE_OPENED",
                            payload: 0,
                        })
                    }
                    aria-label="Toggle left sidebar"
                >
                    <GoSidebarCollapse />
                </button>
            </div>

            {/* Display the dynamic application/note title */}
            <div className="mx-auto text-white select-none">{title}</div>

            {/*
         <div className="flex items-center">
             <button
                 onClick={() =>
                      windows.dispatch({
                          type: "TOGGLE_OPENED",
                          payload: 1,
                      })
                 }
             >
                 <GoSidebarExpand />
             </button>
         </div>
         */}

            <div className="flex items-center bg-transparent">
                {/* Button to close the application */}
                <button
                    onClick={() => invoke("close_app")}
                    aria-label="Close application"
                >
                    <IoCloseCircle />
                </button>
            </div>
        </div>
    );
}

export default Header;
