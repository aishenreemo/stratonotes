import { IoCalendarNumberSharp } from "react-icons/io5";
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

function App() {
    let editorMode = useEditorMode();
    return (
        <div className="p-1 w-screen h-screen">
            <div
                style={{
                    gridTemplateColumns: "auto auto 1fr auto",
                    gridTemplateRows: "auto 1fr auto",
                }}
                className={[
                    "w-full h-full rounded-sm max-w-screen max-h-screen",
                    "border grid",
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
                    <Calendar
                        className={[
                            "m-2 p-2 border overflow-hidden h-auto",
                            "[&>:first-child]:flex [&>div:first-child]justify-center",
                            "[&>:last-child]:text-[0.75rem]",
                        ].join(" ")}
                    />
                </Sidebar>
                <Editor />
                <Sidebar anchor="RIGHT" />
                <Footer />
            </div>
        </div>
    );
}

export default App;
