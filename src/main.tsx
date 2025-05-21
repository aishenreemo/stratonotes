import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { EditorProvider } from "./contexts/EditorContext.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import { ExplorerProvider } from "./contexts/ExplorerContext.tsx";

/**
 * AppProvider Component
 *
 * @component
 * @description This component serves as a central provider for all the application's contexts.
 * It nests `ExplorerProvider`, `EditorProvider`, and `SidebarProvider` to ensure that all
 * child components (specifically the main `App` component) have access to the global state
 * managed by these contexts. The order of nesting might be important if contexts depend on each other,
 * but in this case, they appear to be independent or only consume state from each other.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will be rendered within the context providers.
 * @returns {React.Node} A hierarchy of context providers wrapping the children.
 */
function AppProvider({ children }: { children: ReactNode }) {
  return (
    // ExplorerProvider makes file system and note selection state available
    <ExplorerProvider>
      {/* EditorProvider makes editor content and mode state available */}
      <EditorProvider>
        {/* SidebarProvider makes sidebar open/closed state available */}
        <SidebarProvider>{children}</SidebarProvider>
      </EditorProvider>
    </ExplorerProvider>
  );
}

// Get the root HTML element where the React application will be mounted
const container = document.getElementById("root");

// Ensure the container exists before attempting to create a root
if (container) {
  // Create a React root and render the App component wrapped in AppProvider
  createRoot(container).render(
    <AppProvider>
      <App />
    </AppProvider>
  );
} else {
  // Log an error if the root element is not found, which would prevent the app from mounting
  console.error("Failed to find the root element to mount the React application.");
}
