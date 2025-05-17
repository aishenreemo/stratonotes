import { IoCalendarNumberSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { GoNote } from "react-icons/go";
import { FaCode } from "react-icons/fa";
import { FaMarkdown } from "react-icons/fa";
import { useEditor } from "../contexts/EditorContext";

function Ribbons() {
    let editor = useEditor();
    return (
        <div
            style={{
                gridColumn: "1 / 2",
            }}
            className="flex flex-col items-center py-2 border-r w-8 gap-2"
        >
            <button>
                <IoCalendarNumberSharp />
            </button>
            <button>
                <GoNote />
            </button>
            <button onClick={() => editor.dispatch({ type: "TOGGLE_MODE" })}>
                {editor.state.mode == "SOURCE" ? <FaCode /> : <FaMarkdown />}
            </button>
            <button>
                <IoIosSettings />
            </button>
        </div>
    );
}

export default Ribbons;
