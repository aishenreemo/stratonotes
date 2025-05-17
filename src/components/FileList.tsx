import { invoke } from "@tauri-apps/api/core";
import { useExplorer } from "../contexts/ExplorerContext";

function FileList() {
    let explorer = useExplorer();

    invoke("fetch_notes").then((files) => {
        explorer.dispatch({ type: "FETCH_NOTES", payload: files as String[] });
    });

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
                return (
                    <div
                        key={i}
                        className={[
                            "p-1",
                            // "border",
                            // "border-black",
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
                        ].join(" ")}
                        onClick={() =>
                            explorer.dispatch({ type: "OPEN_NOTE", payload: i })
                        }
                    >
                        {p.replace(/\\/g, "/").split("/").pop()}
                    </div>
                );
            })}
        </div>
    );
}

export default FileList;
