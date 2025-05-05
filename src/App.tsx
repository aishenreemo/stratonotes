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
import { useState } from "react";

function App() {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [leftOpened, setLeftOpened] = useState(false);
    const [rightOpened, setRightOpened] = useState(false);

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
                <Header
                    leftOpened={leftOpened}
                    rightOpened={rightOpened}
                    setLeftOpened={setLeftOpened}
                    setRightOpened={setRightOpened}
                />
                <Ribbons>
                    <button>
                        <IoCalendarNumberSharp />
                    </button>
                    <button>
                        <GoNote />
                    </button>
                    <button onClick={() => setIsSourceMode(!isSourceMode)}>
                        {isSourceMode ? <FaCode /> : <FaMarkdown />}
                    </button>
                    <button>
                        <IoIosSettings />
                    </button>
                </Ribbons>
                <Sidebar isOnLeft={true} isOpened={leftOpened} />
                <Editor
                    isSourceMode={isSourceMode}
                    setIsSourceMode={setIsSourceMode}
                />
                <Sidebar isOnLeft={false} isOpened={rightOpened} />
                <Footer />
            </div>
        </div>
    );
}

export default App;
