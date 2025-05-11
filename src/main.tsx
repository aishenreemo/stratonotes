import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EditorProvider } from "./contexts/EditorContext.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import { ExplorerProvider } from "./contexts/ExplorerContext.tsx";

function AppProvider({ children }: { children: ReactNode }) {
    return (
        <ExplorerProvider>
            <EditorProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </EditorProvider>
        </ExplorerProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <AppProvider>
        <App />
    </AppProvider>
);
