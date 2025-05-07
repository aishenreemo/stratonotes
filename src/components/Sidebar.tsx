import { Resizable } from "re-resizable";
import { ReactNode } from "react";
import { SidebarAnchor, useSidebar } from "../contexts/SidebarContext";

function Sidebar({
    anchor,
    children,
}: {
    anchor: SidebarAnchor;
    children?: ReactNode;
}) {
    let sidebar = useSidebar();
    let isOpened =
        anchor == "LEFT"
            ? sidebar.state.isLeftOpened
            : sidebar.state.isRightOpened;

    return (
        <Resizable
            className={[
                "box-border",
                "border",
                "transition-all",
                "0.05s",
                "overflow-hidden",
                "flex",
                "flex-col",
                "h-full",
            ].join(" ")}
            minWidth={isOpened ? 256 : 0}
            maxWidth={512}
            enable={{
                left: anchor === "RIGHT",
                right: anchor === "LEFT",
            }}
            style={{
                gridColumn: anchor == "LEFT" ? "2 / 3" : "4 / 5",
            }}
            size={{ width: isOpened ? "16rem" : 0 }}
        >
            {children}
        </Resizable>
    );
}

export default Sidebar;
