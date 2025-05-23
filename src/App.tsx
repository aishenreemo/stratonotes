import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Ribbons from "./components/Ribbons";
import Header from "./components/Header";
import Editor from "./components/Editor";
import NoteToolbar from "./components/NoteToolbar";
import Searchbar from "./components/Searchbar";
import FileList from "./components/FileList";
import AIPrompt from "./components/AIPrompt";
import { ToastContainer } from "react-toastify";

/**
 * App Component
 *
 * @component
 * @description The main application component that orchestrates the layout and rendering of all
 * primary UI components. It sets up a grid-based layout for the application, integrating
 * the header, ribbons, sidebars (left and potentially right), the main editor area,
 * and the footer. It also includes a `ToastContainer` for displaying notifications.
 *
 * @returns {React.Node} The root `div` element containing the entire application UI.
 */
function App() {
    return (
        <div className="w-screen h-screen overflow-hidden">
            {/* ToastContainer for displaying notifications throughout the app */}
            <ToastContainer />

            {/* Cloud animation background */}
            <div className="clouds-container">
                <div className="cloud" style={{ top: '20%', animationDuration: '35s' }}></div>
                <div className="cloud" style={{ top: '40%', animationDuration: '45s', animationDelay: '5s' }}></div>
                <div className="cloud" style={{ top: '60%', animationDuration: '40s', animationDelay: '10s' }}></div>
                
                {/* Decorative clouds in lower left and lower right */}
                <img
                    src="/assets/images/cloud.png"
                    alt=""
                    className="decorative-cloud-image fixed left-0 bottom-0 
                        w-[35vw]  /* Adjusted to 35% of viewport width */
                        min-w-[400px]  /* Increased minimum width */
                        max-w-[800px]  /* Increased maximum width */
                        h-auto 
                        opacity-100 
                        pointer-events-none 
                        z-0
                        transition-all duration-300
                        scale-125"
                />
            </div>

            {/* Main application grid layout */}
            <div
                style={{
                    // Defines the grid columns: auto for ribbons, auto for left sidebar,
                    // 1fr for the main editor content, and auto for the right sidebar (if present)
                    gridTemplateColumns: "auto auto 1fr auto",
                    // Defines the grid rows: auto for header, 1fr for main content area, auto for footer
                    gridTemplateRows: "auto 1fr auto",
                }}
                className={[
                    "w-full h-full rounded-sm max-w-screen max-h-screen",
                    "grid", // Enables CSS Grid
                    "overflow-hidden", // Prevents overflow issues within the grid container
                ].join(" ")}
            >
                {/* Header spanning across all grid columns */}
                <Header />

                {/* Ribbons component in the first grid column */}
                <Ribbons />

                {/* Left Sidebar containing search, AI prompt, note toolbar, and file list */}
                <Sidebar anchor="LEFT">
                    <Searchbar />
                    <AIPrompt />
                    <NoteToolbar />
                    <FileList />
                </Sidebar>

                {/* Main Editor component */}
                <Editor />

                {/*
        // Example of a Right Sidebar (currently commented out)
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

                {/* Footer spanning across all grid columns */}
                <Footer />
            </div>
        </div>
    );
}

export default App;
