import { invoke } from "@tauri-apps/api/core";
import { info, error } from "@tauri-apps/plugin-log";
import { FaArrowCircleRight } from "react-icons/fa";
import { useEditor } from "../contexts/EditorContext";
import { useExplorer } from "../contexts/ExplorerContext";
import { useState } from "react";

function AIPrompt() {
    const [promptText, setPromptText] = useState<string>("");
    const editor = useEditor();
    const explorer = useExplorer();

    return (
        <div className="m-1 p-1 border border-black items-start w-auto h-20 flex flex-col">
            <h1>Prompt AI</h1>
            <div className="flex w-full justify-stretch items-stretch p-1 gap-1">
                <input
                    required
                    type="text"
                    placeholder="Write something"
                    className="border outline-none w-full p-1"
                    value={promptText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPromptText(e.target.value)
                    }
                />
                <button
                    className="border"
                    onClick={async () => {
                        if (promptText.trim() == "") {
                            return;
                        }

                        let content = "";
                        if (editor.state.content.trim() != "") {
                            content = `Below is the content of the note\n${editor.state.content}`;
                        }

                        const response = await invoke("prompt", {
                            preamble: content,
                            prompt: promptText,
                        }).catch(error);

                        if (explorer.state.selectedFile == undefined) {
                            const name = await invoke("create_note", {
                                title: "AI Response",
                                content: response,
                            });

                            info(`Prompted: ${promptText} on file ${name}.`);
                        } else {
                            info(
                                `Prompted: ${promptText} on file '${explorer.state.selectedFile}'`
                            );

                            let addedContent = (response as String)
                                .split("\n")
                                .map((s) => `> ${s}`)
                                .join("\n");

                            editor.dispatch({
                                type: "ADD_CONTENT",
                                payload: addedContent,
                            });
                        }

                        setPromptText("");
                    }}
                >
                    <FaArrowCircleRight />
                </button>
            </div>
        </div>
    );
}

export default AIPrompt;
