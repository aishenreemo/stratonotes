import { Resizable } from 're-resizable';

function Sidebar({ isOnLeft, opened }: { isOnLeft: boolean; opened: boolean }) {
    return (
        <Resizable
            className="box-border border border-black transition-all 0.05s overflow-x-hidden"
            minWidth={opened ? 192 : 0}
            maxWidth={384}
            enable={{
                left: !isOnLeft,
                right: isOnLeft
            }}
            style={{
                gridColumn: isOnLeft ? "2 / 3" : "4 / 5"
            }}

            size={{width: opened ?  "16rem" : 0}}>
        </Resizable>

    );
}

export default Sidebar;
