import { ReactNode } from "react";

function NoteToolbar({ children }: { children?: ReactNode }) {
    return (
        <div
            className={[
                "flex",
                "justify-evenly",
                "gap-2",
                "w-auto",
                "h-10",
                "p-1",
                "m-1",
                "border",
                "border-black"
            ].join(" ")}
        >
            {children}
        </div>
    );
}

export default NoteToolbar;
