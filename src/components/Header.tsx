import { GoSidebarCollapse } from "react-icons/go";
import { IoCloseCircle } from "react-icons/io5";
import { useSidebar } from "../contexts/SidebarContext";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useExplorer } from "../contexts/ExplorerContext";

function Header() {
    let sidebar = useSidebar();
    let explorer = useExplorer();
    let [title, setTitle] = useState("Stratonotes");

    useEffect(() => {
        let file = explorer.state.selectedFile;
        if (file === undefined) {
            setTitle("Stratonotes");
            return;
        }

        let basename =
            file.title || file.path.replace(/\\/g, "/").split("/").pop();
        setTitle(`Stratonotes > ${basename}`);
    }, [explorer.state.selectedFile]);

    return (
        <div
            data-tauri-drag-region
            className="flex border-b p-1 gap-1"
            style={{
                gridColumn: "1 / 5",
            }}
        >
            <div className="flex items-center">
                <button
                    onClick={() =>
                        sidebar.dispatch({
                            anchor: "LEFT",
                            type: "TOGGLE_OPENED",
                        })
                    }
                >
                    <GoSidebarCollapse />
                </button>
            </div>
            <div className="mx-auto">{title}</div>
            {/*
            <div className="flex items-center">
                <button
                    onClick={() =>
                        sidebar.dispatch({
                            anchor: "RIGHT",
                            type: "TOGGLE_OPENED",
                        })
                    }
                >
                    <GoSidebarExpand />
                </button>
            </div>
            */}
            <div className="flex items-center">
                <button onClick={() => invoke("close_app")}>
                    <IoCloseCircle />
                </button>
            </div>
        </div>
    );
}

export default Header;
