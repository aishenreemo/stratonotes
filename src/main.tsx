import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EditorModeProvider } from "./contexts/EditorModeContext.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import { ExplorerProvider } from "./contexts/ExplorerContext.tsx";

function AppProvider({ children }: { children: ReactNode }) {
    return (
        <ExplorerProvider>
            <EditorModeProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </EditorModeProvider>
        </ExplorerProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>
);
