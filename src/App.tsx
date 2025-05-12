import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Calendar from "react-calendar";
import NoteToolbar from "./components/NoteToolbar";
import Searchbar from "./components/Searchbar";
import Graphviewer from "./components/Graphviewer";
import FileList from "./components/FileList";

function App() {
    return (
        <div className="w-screen h-screen overflow-y-hidden">
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
                <Ribbons />
                <Sidebar anchor="LEFT">
                    <Searchbar />
                    <Graphviewer />
                    <NoteToolbar />
                    <FileList />
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
