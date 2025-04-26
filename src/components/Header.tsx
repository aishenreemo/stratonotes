import { Dispatch, SetStateAction } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";

function Header({
    leftOpened,
    rightOpened,
    setLeftOpened,
    setRightOpened,
}: {
    leftOpened: boolean;
    rightOpened: boolean;
    setLeftOpened: Dispatch<SetStateAction<boolean>>;
    setRightOpened: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div
            style={{
                gridColumn: "1 / 5",
            }}
            className="flex border-b p-1"
        >
            <div className="flex items-center">
                <button onClick={() => setLeftOpened(!leftOpened)}>
                    <GoSidebarCollapse />
                </button>
            </div>
            <div className="mx-auto">Stratonotes</div>
            <div className="flex items-center">
                <button onClick={() => setRightOpened(!rightOpened)}>
                    <GoSidebarExpand />
                </button>
            </div>
        </div>
    );
}

export default Header;
