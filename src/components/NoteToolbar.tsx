import { RiDeleteBin5Line } from "react-icons/ri";
import { MdNoteAdd } from "react-icons/md";
import { PiFloppyDiskBackFill } from "react-icons/pi";
import { invoke } from "@tauri-apps/api/core";
import { Note, useExplorer } from "../contexts/ExplorerContext";
import { useEditor } from "../contexts/EditorContext";
import { error, info } from "@tauri-apps/plugin-log";
import { Bounce, toast } from "react-toastify";

/**
 * NoteToolbar Component
 *
 * @component
 * @description A toolbar providing essential note management functionalities: **saving, deleting, and creating notes**.
 * This component integrates with the `ExplorerContext` to manage file selection and fetching, and the `EditorContext`
 * for accessing note content. It also utilizes Tauri's `invoke` for backend communication and `react-toastify` for user notifications.
 *
 * @returns {React.ReactNode} A `div` element containing three interactive buttons for note operations.
 */
function NoteToolbar(): React.ReactNode {
    const explorer = useExplorer();
    const editor = useEditor();

    return (
        <div
            className={[
                "flex",
                "justify-evenly",
                "gap-2",
                "w-auto",
                "h-10",
                "p-1",
                "m-1",
                "rounded-lg",
            ].join(" ")}
        >
            {/* Save Note Button */}
            <button
                title="Save note"
                style={{
                    backgroundColor: "#ffffff50",
                }}
                className={[
                    "flex",
                    "flex-grow",
                    "justify-center",
                    "items-center",
                    "cursor-pointer",
                    "hover:bg-gray-200",
                    "hover:drop-shadow-sm",
                    "hover:scale-105",
                    "rounded",
                    "transition-all",
                    "text-[#466fb8]",
                    "text-shadow-stone-950",
                ].join(" ")}
                onClick={async () => {
                    await invoke("save_note", {
                        filePath: explorer.state.selectedFile?.path,
                        noteContent: editor.state.content,
                    })
                        .then(() => {
                            info(`Saved ${explorer.state.selectedFile?.path}.`);
                        })
                        .catch(error);

                    await invoke("fetch_notes")
                        .then((files) => {
                            explorer.dispatch({
                                type: "FETCH_NOTES",
                                payload: files as Note[],
                            });
                        })
                        .catch(error);

                    toast("Note saved.", {
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
                }}
            >
                <PiFloppyDiskBackFill />
            </button>

            {/* Delete Note Button */}
            <button
                title="Delete note"
                style={{
                    backgroundColor: "#ffffff50",
                }}
                className={[
                    "flex",
                    "flex-grow",
                    "justify-center",
                    "items-center",
                    "cursor-pointer",
                    "hover:bg-gray-200",
                    "hover:drop-shadow-sm",
                    "transition-all",
                    "hover:scale-105",
                    "rounded",
                    "text-[#466fb8]",
                ].join(" ")}
                onClick={async () => {
                    if (explorer.state.selectedFile === undefined) {
                        return;
                    }
                    await invoke("delete_note", {
                        filePath: explorer.state.selectedFile?.path,
                    }).catch(error);

                    await invoke("fetch_notes")
                        .then((files) => {
                            explorer.dispatch({
                                type: "FETCH_NOTES",
                                payload: files as Note[],
                            });
                            explorer.dispatch({
                                type: "OPEN_NOTE",
                                payload: -1, // Deselect any open note
                            });
                        })
                        .catch(error);

                    toast("Note deleted.", {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        transition: Bounce,
                        className: "shadow-lg rounded-lg",
                    });
                }}
            >
                <RiDeleteBin5Line />
            </button>

            {/* Create New Note Button */}
            <button
                title="Create new note"
                style={{
                    backgroundColor: "#ffffff50",
                }}
                className={[
                    "bg-white",
                    "flex",
                    "flex-grow",
                    "justify-center",
                    "items-center",
                    "cursor-pointer",
                    "hover:bg-white", // Darker hover for black background
                    "hover:drop-shadow-sm",
                    "hover:scale-105",
                    "rounded",
                    "transition-all",
                    "text-[#466fb8]",
                ].join(" ")}
                onClick={async () => {
                    const filepath = await invoke("create_note", {
                        title: "Untitled",
                    }).catch(error);

                    await invoke("fetch_notes")
                        .then((files) => {
                            explorer.dispatch({
                                type: "FETCH_NOTES",
                                payload: files as Note[],
                            });
                            explorer.dispatch({
                                type: "OPEN_NOTE",
                                payload: (files as Note[]).findIndex(
                                    (f) => f.path === filepath
                                ),
                            });
                        })
                        .catch(error);

                    toast("Note created.", {
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
                }}
            >
                <MdNoteAdd />
            </button>
        </div>
    );
}

export default NoteToolbar;
