import { IoCalendarNumberSharp } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdNoteAdd } from "react-icons/md";
import { HiSave } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { GoNote } from "react-icons/go";
import { FaCode } from "react-icons/fa";
import { FaMarkdown } from "react-icons/fa";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Calendar from "react-calendar";
import { useEditorMode } from "./contexts/EditorModeContext";
import NoteToolbar from "./components/NoteToolbar";
import Searchbar from "./components/Searchbar";

function App() {
    let editorMode = useEditorMode();
    return (
        <div className="w-screen h-screen">
            <div
                style={{
                    gridTemplateColumns: "auto auto 1fr auto",
                    gridTemplateRows: "auto 1fr auto",
                }}
                className={[
                    "w-full h-full rounded-sm max-w-screen max-h-screen",
                    "grid",
                ].join(" ")}
            >
                <Header />
                <Ribbons>
                    <button>
                        <IoCalendarNumberSharp />
                    </button>
                    <button>
                        <GoNote />
                    </button>
                    <button
                        onClick={() =>
                            editorMode.dispatch({ type: "TOGGLE_MODE" })
                        }
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
                </Ribbons>
                <Sidebar anchor="LEFT">
                    <Searchbar />
                    <NoteToolbar>
                        <button title="Save note" className="flex flex-grow justify-center items-center">
                            <HiSave />
                        </button>
                        <button title="Delete note" className="flex flex-grow justify-center items-center">
                            <RiDeleteBin5Line />
                        </button>
                        <button title="Create new note" className="flex flex-grow justify-center items-center">
                            <MdNoteAdd />
                        </button>
                    </NoteToolbar>
                    <div className=''>

                    </div>
                </Sidebar>
                <Editor />
                <Sidebar anchor="RIGHT">
                    <Calendar
                        className={[
                            "m-2 p-2 border overflow-hidden h-auto",
                            "[&>:first-child]:flex [&>div:first-child]justify-center",
                            "[&>:last-child]:text-[0.75rem]",
                        ].join(" ")}
                    />
                </Sidebar>

                <Footer />
            </div>
        </div>
    );
}

export default App;
