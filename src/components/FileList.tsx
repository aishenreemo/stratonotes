import { invoke } from "@tauri-apps/api/core";
import { Note, useExplorer } from "../contexts/ExplorerContext";
import { useEffect } from "react";
import { error } from "@tauri-apps/plugin-log";

function FileList() {
    let explorer = useExplorer();

    useEffect(() => {
        invoke("fetch_notes")
            .then((files) => {
                explorer.dispatch({
                    type: "FETCH_NOTES",
                    payload: files as Note[],
                });
            })
            .catch(error);
    }, [explorer.state.selectedFile]);

    return (
        <div
            className={[
                "flex flex-col gap-1",
                "m-1",
                "p-2 pr-4",
                "border",
                "border-black",
                "w-auto",
                "h-10",
                "flex-grow",
                "overflow-y-scroll",
                "overflow-x-hidden",
            ].join(" ")}
        >
            {explorer.state.files.map((p, i) => {
                let isActive = p.path == explorer.state.selectedFile?.path;
                return (
                    <div
                        key={i}
                        className={[
                            "p-1",
                            "cursor-pointer",
                            "hover:bg-gray-100",
                            "hover:drop-shadow-md",
                            "hover:scale-102",
                            "rounded",
                            "transition-all",
                            "min-h-8",
                            "text-ellipsis",
                            "whitespace-nowrap",
                            "overflow-clip",
                            isActive ? "bg-gray-100" : "",
                        ].join(" ")}
                        onClick={() => {
                            if (!isActive) {
                                explorer.dispatch({
                                    type: "OPEN_NOTE",
                                    payload: i,
                                });
                            }
                        }}
                    >
                        {p?.title ||
                            p?.path?.replace(/\\/g, "/").split("/").pop()}
                    </div>
                );
            })}
        </div>
    );
}

export default FileList;
