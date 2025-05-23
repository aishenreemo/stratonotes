import { ReactNode } from "react";

function Window({
    width,
    height,
    className,
    children,
}: {
    width: string;
    height: string;
    className: string;
    children?: ReactNode;
}) {
    return (
        <div
            style={{
                width,
                height,
            }}
            className={[
                "absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]",
                "bg-foreground border border-background rounded-2xl z-10",
                className || "",
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export default Window;