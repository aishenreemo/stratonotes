function Sidebar({ isOnLeft, opened }: { isOnLeft: boolean; opened: boolean }) {
    return (
        <div
            style={{
                gridColumn: isOnLeft ? "2 / 3" : "4 / 5",
            }}
            className={[
                "flex flex-col transition-all",
                "duration-300 overflow-x-hidden",
                opened ? "w-[12rem] border" : "w-0",
            ].join(" ")}
        ></div>
    );
}

export default Sidebar;
