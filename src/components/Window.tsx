import { ReactNode } from "react";

function Window({
    width,
    height,
    children,
}: {
    width: number;
    height: number;
    children?: ReactNode;
}) {
    return (
        <div
            className={`absolute w-[${width}%] h-[${height}%] border rounded-2xl`}
        >
            {children}
        </div>
    );
}

export default Window;
