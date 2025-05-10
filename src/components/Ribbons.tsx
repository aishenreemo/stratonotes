import { IoCalendarNumberSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { GoNote } from "react-icons/go";
import { FaCode } from "react-icons/fa";
import { FaMarkdown } from "react-icons/fa";
import { useEditorMode } from "../contexts/EditorModeContext";

function Ribbons() {
    let editorMode = useEditorMode();
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
            <button
                onClick={() => editorMode.dispatch({ type: "TOGGLE_MODE" })}
            >
                {editorMode.state.mode == "SOURCE" ? (
                    <FaCode />
                ) : (
                    <FaMarkdown />
                )}
            </button>
            <button>
                <IoIosSettings />
            </button>
        </div>
    );
}

export default Ribbons;
