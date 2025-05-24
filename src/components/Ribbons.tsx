import { IoIosSettings } from "react-icons/io";
import { FaCloud, FaCode } from "react-icons/fa";
import { FaMarkdown } from "react-icons/fa";
import { useEditor } from "../contexts/EditorContext";
import { invoke } from "@tauri-apps/api/core";

/**
 * Ribbons Component
 *
 * @component
 * @description A vertical sidebar component located on the far left of the application
 * that provides quick access to various editor modes and application settings.
 * It currently allows users to toggle between source code (text) and Markdown preview modes.
 *
 * @returns {React.ReactNode} A `div` element serving as the ribbons sidebar, containing
 * buttons for different functionalities.
 */
function Ribbons(): React.ReactNode {
    const editor = useEditor();
    return (
        <div
            style={{
                gridColumn: "1 / 2", // Positions the component in the first column of a grid layout
            }}
            className="flex flex-col items-center py-2 border-r w-8 gap-2" // Styling for vertical alignment, padding, border, width, and spacing
        >
            {/*
         <button>
             <IoCalendarNumberSharp />
         </button>
         <button>
             <GoNote />
         </button>
         */}
            <button onClick={() => invoke("toggle_theme")}>
                <FaCloud />
            </button>
            {/* Button to toggle between Source (Code) and Markdown (Preview) modes */}
            <button
                onClick={() => editor.dispatch({ type: "TOGGLE_MODE" })}
                title={
                    editor.state.mode === "SOURCE"
                        ? "View as Markdown"
                        : "View as Source"
                }
            >
                {/* Displays a code icon in source mode, and a Markdown icon in preview mode */}
                {editor.state.mode === "SOURCE" ? <FaCode /> : <FaMarkdown />}
            </button>

            {/* Button for application settings */}
            <button title="Settings">
                <IoIosSettings />
            </button>
        </div>
    );
}

export default Ribbons;
