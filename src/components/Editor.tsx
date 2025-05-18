import { useEffect, useRef } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useEditor } from "../contexts/EditorContext";
import { useExplorer } from "../contexts/ExplorerContext";
import { error, info } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";

function Editor() {
    const explorer = useExplorer();
    const editor = useEditor();
    const isSourceMode = editor.state.mode === "SOURCE";
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (explorer.state.selectedFile == undefined) {
            editor.dispatch({ type: "SET_CONTENT", payload: "" });
            return;
        }

        info(`Opened ${explorer.state.selectedFile}.`);
        invoke("open_note", { filePath: explorer.state.selectedFile })
            .then((content: any) =>
                editor.dispatch({ type: "SET_CONTENT", payload: content })
            )
            .catch(error);
    }, [explorer.state.selectedFile]);

    useEffect(() => {
        if (editor.state.mode == "SOURCE") {
            textareaRef?.current?.focus();
        }
    }, [editor.state.mode]);

    return (
        <div className="p-1 m-1 w-auto h-auto overflow-hidden">
            {isSourceMode ? (
                <textarea
                    ref={textareaRef} 
                    className="border w-full h-full outline-none resize-none p-4"
                    value={editor.state.content as string}
                    onChange={(e) =>
                        editor.dispatch({
                            type: "SET_CONTENT",
                            payload: e.target.value,
                        })
                    }
                />
            ) : (
                <div
                    onClick={() =>
                        editor.dispatch({
                            type: "SET_MODE",
                            payload: "READING",
                        })
                    }
                    className="markdown-body w-full h-full border p-4 overflow-y-auto"
                >
                    <MarkdownPreview
                        source={editor.state.content as string}
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
