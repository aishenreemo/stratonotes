import { RiDeleteBin5Line } from "react-icons/ri";
import { MdNoteAdd } from "react-icons/md";
import { PiFloppyDiskBackFill } from "react-icons/pi";
import { invoke } from "@tauri-apps/api/core";
import { Note, useExplorer } from "../contexts/ExplorerContext";
import { useEditor } from "../contexts/EditorContext";
import { error, info } from "@tauri-apps/plugin-log";

function NoteToolbar() {
    let explorer = useExplorer();
    let editor = useEditor();
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
                "border",
                "border-black",
            ].join(" ")}
        >
            <button
                title="Save note"
                className={[
                    "bg-white",
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

                    await invoke("fetch_notes").then((files) => {
                        explorer.dispatch({ type: "FETCH_NOTES", payload: files as Note[] });
                    }).catch(error);
                }}
            >
                <PiFloppyDiskBackFill />
            </button>
            <button
                title="Delete note"
                className={[
                    "bg-white",
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
                ].join(" ")}
                onClick={async () => {
                    await invoke("delete_note", {
                        filePath: explorer.state.selectedFile?.path,
                    }).catch(error);

                    await invoke("fetch_notes").then((files) => {
                        explorer.dispatch({ type: "FETCH_NOTES", payload: files as Note[] });
                        explorer.dispatch({ type: "OPEN_NOTE", payload: -1 });
                    }).catch(error);
                }}
            >
                <RiDeleteBin5Line />
            </button>
            <button
                title="Create new note"
                className={[
                    "bg-black",
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
                ].join(" ")}
                onClick={async () => {
                    const filepath = await invoke("create_note", {
                        title: "Untitled",
                    }).catch(error);

                    await invoke("fetch_notes").then((files) => {
                        explorer.dispatch({ type: "FETCH_NOTES", payload: files as Note[] });
                        explorer.dispatch({ type: "OPEN_NOTE", payload: (files as Note[]).findIndex(f => f.path == filepath) });
                    }).catch(error);
                }}
            >
                <MdNoteAdd />
            </button>
        </div>
    );
}

export default NoteToolbar;
