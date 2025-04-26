import { ReactNode } from "react";

function Ribbons({ children }: { children?: ReactNode }) {
    return (
        <div
            style={{
                gridColumn: "1 / 2",
            }}
            className="flex flex-col items-center py-2 border-r w-8 gap-2"
        >
            {children}
        </div>
    );
}

export default Ribbons;
