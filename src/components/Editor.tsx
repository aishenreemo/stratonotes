import { useEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useEditorMode } from "../contexts/EditorModeContext";
import { useExplorer } from "../contexts/ExplorerContext";
import { error, info } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";

function Editor() {
    const explorer = useExplorer();
    const editorMode = useEditorMode();
    const isSourceMode = editorMode.state.mode === "SOURCE";
    const [markdown, setMarkdown] = useState("# No file opened yet.");

    useEffect(() => {
        info(`Opened ${explorer.state.selectedFile}.`);
        invoke("open_note", { filePath: explorer.state.selectedFile })
            .then((content: any) => setMarkdown(content))
            .catch(error);
    }, [explorer.state.selectedFile]);

    return (
        <div className="p-1 m-1 w-auto h-auto overflow-hidden">
            {isSourceMode ? (
                <textarea
                    className="border w-full h-full outline-none resize-none p-4"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                />
            ) : (
                <div
                    onClick={() =>
                        editorMode.dispatch({
                            type: "SET_MODE",
                            payload: "READING",
                        })
                    }
                    className="markdown-body w-full h-full border p-4 overflow-y-auto"
                >
                    <MarkdownPreview
                        source={markdown}
                        style={{ backgroundColor: "transparent" }}
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
