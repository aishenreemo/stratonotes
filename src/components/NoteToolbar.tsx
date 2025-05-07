import { ReactNode } from 'react'

function NoteToolbar({ children }: { children?: ReactNode }) {
  return (
    <div className={[
        "flex",
        "flex-row",
        "items-center",
        "justify-around",
        "gap-2",
        "border",
        "border-black",
        "w-auto"].join(" ")}>
      {children}
    </div>
  )
}

export default NoteToolbar
