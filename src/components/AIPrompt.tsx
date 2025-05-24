import { invoke } from "@tauri-apps/api/core";
import { info, error } from "@tauri-apps/plugin-log";
import { FaArrowCircleRight } from "react-icons/fa";
import { useEditor } from "../contexts/EditorContext";
import { Note, useExplorer } from "../contexts/ExplorerContext";
import { useState } from "react";
import { toast, Bounce } from "react-toastify";

/**
 * AIPrompt Component
 *
 * @component
 * @description This component provides an interactive input field and a submission button for users to send prompts to an AI.
 * It integrates with the `EditorContext` to include the current note's content as preamble for the AI, and with the
 * `ExplorerContext` to manage the display of AI responses—either by creating a new note for the response or appending
 * it to the current note. It uses Tauri's `invoke` for backend communication with the AI model and `react-toastify`
 * for user feedback.
 *
 * @returns {React.ReactNode} A `div` element containing a heading, a text input field for the AI prompt,
 * and a button to submit the prompt.
 */
function AIPrompt(): React.ReactNode {
    const [promptText, setPromptText] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);
    const editor = useEditor();
    const explorer = useExplorer();

    async function onButtonPress() {
        setDisabled(true);
        if (promptText.trim() == "") {
            return;
        }

        const promptNotificationID = toast("Prompting...", {
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
        });

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
            }).catch(error);

            info(`Prompted: ${promptText} on file ${name}.`);

            await invoke("fetch_notes")
                .then((files) => {
                    explorer.dispatch({
                        type: "FETCH_NOTES",
                        payload: files as Note[],
                    });
                    explorer.dispatch({
                        type: "OPEN_NOTE",
                        payload: (files as Note[]).findIndex(
                            (f) => f.path == name
                        ),
                    });
                })
                .catch(error);
        } else {
            info(
                `Prompted: ${promptText} on file '${explorer.state.selectedFile.path}'`
            );

            let addedContent = (response as String)
                .split("\n")
                .map((s) => `> ${s}`)
                .join("\n");

            editor.dispatch({ type: "ADD_CONTENT", payload: addedContent });
        }

        setPromptText("");
        setDisabled(false);
        toast.dismiss(promptNotificationID);
    }

    return (
        <div className="m-1 p-1 items-start w-auto h-20 flex flex-col rounded-lg">
            <h1>Prompt AI</h1>
            <div className="flex w-full justify-stretch items-stretch p-1 gap-1">
                <input
                    required
                    disabled={disabled}
                    type="text"
                    placeholder="Write something..."
                    className="bg-white/50 outline-none w-full p-1 rounded-lg"
                    value={promptText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPromptText(e.target.value)
                    }
                />
                <button
                    disabled={disabled}
                    className="p-2 rounded-lg flex items-center justify-center"
                    onClick={onButtonPress}
                    style={{ minWidth: "2rem", minHeight: "2rem" }}
                >
                    <FaArrowCircleRight />
                </button>
            </div>
        </div>
    );
}

export default AIPrompt;
