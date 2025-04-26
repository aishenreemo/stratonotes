import { IoCalendarNumberSharp } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { GoNote } from "react-icons/go";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import { useState } from "react";

function App() {
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
                    "border border-white grid",
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
                    <button>
                        <IoIosSettings />
                    </button>
                </Ribbons>
                <Sidebar isOnLeft={true} opened={leftOpened} />
                <div
                    style={{
                        gridColumn: "3 / 4",
                    }}
                    className="p-2 border border-red-500 m-2"
                >
                    Main App
                </div>
                <Sidebar isOnLeft={false} opened={rightOpened} />
                <Footer />
            </div>
        </div>
    );
}

export default App;
