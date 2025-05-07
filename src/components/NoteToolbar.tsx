    import { ReactNode } from 'react'

    function NoteToolbar({ children }: { children?: ReactNode }) {
    return (
        <div className={[
            "flex",
            "justify-evenly",
            "gap-2",
            "w-auto",
            "p-1",
            "h-10"
            ].join(" ")}>
        {children}
        </div>
    )
    }

    export default NoteToolbar
