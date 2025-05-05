import { Resizable } from "re-resizable";

function Sidebar({
    isOnLeft,
    isOpened,
}: {
    isOnLeft: boolean;
    isOpened: boolean;
}) {
    return (
        <Resizable
            className="box-border border transition-all 0.05s overflow-x-hidden"
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
        ></Resizable>
    );
}

export default Sidebar;
