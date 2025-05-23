import { useEffect, useRef } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useEditor } from "../contexts/EditorContext";
import { useExplorer } from "../contexts/ExplorerContext";
import { error } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";

/**
 * Editor Component
 *
 * @component
 * @description The main editor component allows users to view and edit their notes.
 * It dynamically switches between a `textarea` for raw markdown editing (source mode)
 * and a `MarkdownPreview` component for rendering the markdown content (reading mode).
 * The component interacts with the `ExplorerContext` to load the content of the currently
 * selected note and with the `EditorContext` to manage the editor's content and mode.
 *
 * @returns {React.ReactNode} A `div` element containing either a `textarea` or a `MarkdownPreview`
 * based on the current editor mode.
 */
function Editor(): React.ReactNode {
    const explorer = useExplorer();
    const editor = useEditor();
    const isSourceMode = editor.state.mode === "SOURCE";
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Effect hook to load note content when the selected file changes.
     * If no file is selected, the editor content is cleared.
     * Otherwise, it invokes the `open_note` command from the backend
     * to fetch the content of the selected file and updates the editor's state.
     */
    useEffect(() => {
        if (explorer.state.selectedFile === undefined) {
            editor.dispatch({ type: "SET_CONTENT", payload: "" });
            return;
        }

        invoke("open_note", { filePath: explorer.state.selectedFile?.path })
            .then((content: any) =>
                editor.dispatch({ type: "SET_CONTENT", payload: content })
            )
            .catch(error);
    }, [explorer.state.selectedFile?.path]); // Depend on selectedFile.path to refetch when a new file is chosen

    /**
     * Effect hook to focus the textarea when the editor switches to source mode.
     * This provides a better user experience by automatically placing the cursor
     * in the editable area.
     */
    useEffect(() => {
        if (editor.state.mode === "SOURCE") {
            textareaRef?.current?.focus();
        }
    }, [editor.state.mode]); // Depend on editor.state.mode to trigger focus when mode changes

    return (
        <div className="p-1 m-1 w-auto h-auto overflow-hidden bg-background">
            {isSourceMode ? (
                // Render a textarea for editing when in source mode
                <textarea
                    ref={textareaRef}
                    className="border w-full h-full outline-none resize-none p-4 rounded-2xl shadow-2xl shadow-gray-500/50"
                    value={editor.state.content as string}
                    onChange={(e) =>
                        editor.dispatch({
                            type: "SET_CONTENT",
                            payload: e.target.value,
                        })
                    }
                />
            ) : (
                // Render Markdown preview when not in source mode
                <div
                    onClick={() =>
                        editor.dispatch({
                            type: "SET_MODE",
                            payload: "READING", // Explicitly set to reading mode on click (though already in it)
                        })
                    }
                    className="markdown-body w-full h-full border p-4 overflow-y-auto rounded-2xl shadow-2xl shadow-gray-500/50"
                >
                    <MarkdownPreview
                        source={editor.state.content as string}
                        style={{ backgroundColor: "transparent" }}
                        // Custom rewrite function to remove links from headings in the preview
                        rehypeRewrite={(node, _, parent) => {
                            if (
                                (node as any).tagName === "a" &&
                                parent &&
                                /^h[1-6]/.test((parent as any).tagName)
                            ) {
                                parent.children = parent.children.slice(1);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Editor;
