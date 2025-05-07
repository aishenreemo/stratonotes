import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { useSidebar } from "../contexts/SidebarContext";

function Header() {
    let sidebar = useSidebar();
    return (
        <div
            style={{
                gridColumn: "1 / 5",
            }}
            className="flex border-b p-1"
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
            <div className="mx-auto">Stratonotes</div>
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
        </div>
    );
}

export default Header;
