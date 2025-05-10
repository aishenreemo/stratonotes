import { RiDeleteBin5Line } from "react-icons/ri";
import { MdNoteAdd } from "react-icons/md";
import { PiFloppyDiskBackFill } from "react-icons/pi";
import { invoke } from "@tauri-apps/api/core";
import { info } from "@tauri-apps/plugin-log";

function NoteToolbar() {
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

                onClick={() =>{
                    invoke("save_note")
                    info("note saved yeyeyeyeyyey ")
                }}
            >
                <PiFloppyDiskBackFill />
            </button>
            <button
                title="Delete note"
                className="flex flex-grow justify-center items-center"
            >
                <RiDeleteBin5Line />
            </button>
            <button
                title="Create new note"
                className="flex flex-grow justify-center items-center"
            >
                <MdNoteAdd />
            </button>
        </div>
    );
}

export default NoteToolbar;
