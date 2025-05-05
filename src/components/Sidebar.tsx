import { Resizable } from "re-resizable";
import { ReactNode } from "react";

function Sidebar({
    isOnLeft,
    isOpened,
    children,
}: {
    isOnLeft: boolean;
    isOpened: boolean;
    children?: ReactNode;
}) {
    return (
        <Resizable
            className="box-border border transition-all 0.05s overflow-hidden"
            minWidth={isOpened ? 256 : 0}
            maxWidth={512}
            enable={{
                left: !isOnLeft,
                right: isOnLeft,
            }}
            style={{
                gridColumn: isOnLeft ? "2 / 3" : "4 / 5",
            }}
            size={{ width: isOpened ? "16rem" : 0 }}
        >
            {children}
        </Resizable>
    );
}

export default Sidebar;
