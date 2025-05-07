import { ReactNode } from "react";

function FileList({ children }: { children?: ReactNode }) {
    return (
        <div
            className={[
                "m-1",
                "border",
                "border-black",
                "w-auto",
                "h-10",
                "flex-grow",
                "overflow-x-hidden",
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export default FileList;
