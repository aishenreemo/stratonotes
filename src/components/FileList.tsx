import { invoke } from "@tauri-apps/api/core";
import { Note, useExplorer } from "../contexts/ExplorerContext";
import { useEffect } from "react";
import { error } from "@tauri-apps/plugin-log";

/**
 * FileList Component
 *
 * @component
 * @description A file explorer component that displays a list of all available notes.
 * Users can click on these entries to open and view/edit the corresponding note in the editor.
 * It uses the `ExplorerContext` to manage and display the list of notes and to handle
 * the selection of a specific note.
 *
 * @returns {ReactNode} A `div` element containing a scrollable list of clickable note titles.
 */
function FileList(): React.ReactNode {
    const explorer = useExplorer();

    /**
     * Effect hook to fetch notes from the backend when the component mounts
     * or when the `selectedFile` in the explorer context changes. This ensures
     * the file list is always up-to-date.
     */
    useEffect(() => {
        invoke("fetch_notes")
            .then((files) => {
                explorer.dispatch({
                    type: "FETCH_NOTES",
                    payload: files as Note[],
                });
            })
            .catch(error);
    }, [explorer.state.selectedFile]); // Dependency array: re-run effect when selectedFile changes

    return (
        <div
            className={[
                "border-t-2",
                "border-white/30",
                "flex flex-col gap-1",
                "mx-2",
                "my-2",
                "p-2 pr-6",
                "w-auto",
                "h-10",
                "flex-grow",
                "overflow-y-scroll",
                "overflow-x-hidden",
                "scrollbar-thin",
                "scrollbar-thumb-gray-400",
                "scrollbar-thumb-rounded-br", // Rounds only bottom-right of thumb
            ].join(" ")}
            style={{
                scrollbarColor: "#9ca3af transparent", // gray-400 thumb, transparent track
                scrollbarWidth: "thin",
            }}
        >
            {/* Map over the files in the explorer state to render each note */}
            {explorer.state.files
                .map((p, i) => [p, i])
                .filter(
                    (p) =>
                        (p[0] as Note).path.includes(explorer.state.query) ||
                        (p[0] as Note).title
                            ?.toLowerCase()
                            ?.includes(explorer.state.query)
                )
                .map((p, i) => {
                    // Determine if the current note is the actively selected one
                    const isActive =
                        (p[0] as Note).path ===
                        explorer.state.selectedFile?.path;
                    return (
                        <div
                            key={i} // Unique key for each list item
                            className={[
                                "p-1",
                                "cursor-pointer",
                                "hover:bg-gray-100",
                                "dark:hover:bg-gray-100/30",
                                "hover:drop-shadow-md",
                                "hover:scale-102",
                                "rounded",
                                "transition-all",
                                "min-h-8",
                                "text-ellipsis",
                                "whitespace-nowrap",
                                "overflow-clip",
                                isActive ? "bg-gray-100/30" : "", // Apply active styling if selected
                            ].join(" ")}
                            onClick={() => {
                                // Only dispatch if a different note is clicked to avoid unnecessary re-renders
                                if (!isActive) {
                                    explorer.dispatch({
                                        type: "OPEN_NOTE",
                                        payload: p[1] as number, // Payload is the index of the clicked note
                                    });
                                }
                            }}
                        >
                            {/* Display the note's title, or derive it from the path if no title exists */}
                            {(p[0] as Note)?.title ||
                                (p[0] as Note)?.path
                                    ?.replace(/\\/g, "/")
                                    .split("/")
                                    .pop()}
                        </div>
                    );
                })}
        </div>
    );
}

export default FileList;
