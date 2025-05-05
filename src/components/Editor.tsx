import { Dispatch, SetStateAction, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

function Editor({
    isSourceMode,
    setIsSourceMode,
}: {
    isSourceMode: boolean;
    setIsSourceMode: Dispatch<SetStateAction<boolean>>;
}) {
    const [markdown, setMarkdown] = useState("# Hello World");

    return (
        <div className="p-1 m-1 w-auto h-auto">
            {isSourceMode ? (
                <textarea
                    className="border w-full h-full outline-none resize-none p-4"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                />
            ) : (
                <div
                    onClick={() => setIsSourceMode(true)}
                    className="markdown-body w-full h-full border p-4 overflowy-auto"
                >
                    <MarkdownPreview
                        source={markdown}
                        style={{ backgroundColor: "transparent" }}
                        rehypeRewrite={(node, _, parent) => {
                            if (
                                (node as any).tagName === "a" &&
                                parent &&
                                /^h(1|2|3|4|5|6)/.test((parent as any).tagName)
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
