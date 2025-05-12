import { RiDeleteBin5Line } from "react-icons/ri";
import { MdNoteAdd } from "react-icons/md";
import { PiFloppyDiskBackFill } from "react-icons/pi";
import { invoke } from "@tauri-apps/api/core";
import { useExplorer } from "../contexts/ExplorerContext";
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
                className="flex flex-grow justify-center items-center"

                onClick={async () =>{
                    invoke("save_note", {
                        filePath: explorer.state.selectedFile,
                        noteContent: editor.state.content,
                    }).then(() => {
                        info(`Saved ${explorer.state.selectedFile}.`);
                    }).catch(error);
                }}
            >
                <PiFloppyDiskBackFill />
            </button>
            <button
                title="Delete note"
                className="flex flex-grow justify-center items-center"

                onClick={async () =>{
                    invoke("delete_note", {
                        filePath: explorer.state.selectedFile,
                    }).then(() => {
                        info(`deleted ${explorer.state.selectedFile}.`);
                    }).catch(error);
                }}
            >
                <RiDeleteBin5Line />
            </button>
            <button
                title="Create new note"
                className="flex flex-grow justify-center items-center"

                onClick={async () =>{
                    invoke("create_note", {
                        title: "Untitled",
                    }).then(() => {
                        info(`Created a new note.`);
                    }).catch(error);
                }}

            >
                <MdNoteAdd />
            </button>
        </div>
    );
}

export default NoteToolbar;
