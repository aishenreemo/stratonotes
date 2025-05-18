import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import Editor from "./components/Editor";
import NoteToolbar from "./components/NoteToolbar";
import Searchbar from "./components/Searchbar";
import FileList from "./components/FileList";
import AIPrompt from "./components/AIPrompt";

function App() {
    return (
        <div className="w-screen h-screen overflow-hidden">
            <div
                style={{
                    gridTemplateColumns: "auto auto 1fr auto",
                    gridTemplateRows: "auto 1fr auto",
                }}
                className={[
                    "w-full h-full rounded-sm max-w-screen max-h-screen",
                    "grid",
                    "overflow-hidden",
                ].join(" ")}
            >
                <Header />
                <Ribbons />
                <Sidebar anchor="LEFT">
                    <Searchbar />
                    <AIPrompt />
                    <NoteToolbar />
                    <FileList />
                </Sidebar>
                <Editor />
                {/*
                <Sidebar anchor="RIGHT">
                    <Calendar
                        className={[
                            "m-1 p-2 border overflow-hidden h-auto",
                            "[&>:first-child]:flex [&>div:first-child]justify-center",
                            "[&>:last-child]:text-[0.75rem]",
                        ].join(" ")}
                    />
                </Sidebar>
                */}
                <Footer />
            </div>
        </div>
    );
}

export default App;
