import { Resizable } from "re-resizable";
import { ReactNode } from "react";
import { SidebarAnchor, useSidebar } from "../contexts/SidebarContext";

/**
 * Sidebar Component
 *
 * @component
 * @description A resizable sidebar component that can be anchored to either the left or right
 * of the application layout. Its visibility and width are controlled by the `SidebarContext`.
 * This component wraps its children, allowing dynamic content to be displayed within the sidebar.
 *
 * @param {object} props - The component props.
 * @param {SidebarAnchor} props.anchor - Specifies whether the sidebar is "LEFT" or "RIGHT" anchored.
 * @param {ReactNode} [props.children] - The content to be rendered inside the sidebar.
 *
 * @returns {React.ReactNode} A `Resizable` component configured as a sidebar.
 */
function Sidebar({
    anchor,
    children,
}: {
    anchor: SidebarAnchor;
    children?: ReactNode;
}): React.ReactNode {
    const sidebar = useSidebar(); // Access sidebar state and dispatch from context

    // Determine if the current sidebar instance is opened based on its anchor
    const isOpened =
        anchor === "LEFT"
            ? sidebar.state.isLeftOpened
            : sidebar.state.isRightOpened;

    return (
        <Resizable
            className={[
                "box-border", // Ensures padding and border are included in the element's total width and height
                "border-2", // Adds a border around the sidebar
                "transition-all", // Smooth transition for size changes
                "0.05s", // Transition duration
                "overflow-hidden", // Hides content that overflows the sidebar's bounds
                "flex", // Enables flexbox layout for children
                "flex-col", // Arranges children in a column
                // Ensures the sidebar takes full height of its parent
                anchor === "LEFT" ? "rounded-r-2xl" : "rounded-l-2xl", // Rounded only on the side away from the edge
                "bg-transparent", // Background color
                "border-l-0",
                "border-t-0",
                "border-b-0",
                "border-white/50",
            ].join(" ")}
            minWidth={isOpened ? 256 : 0} // Minimum width: 256px when open, 0px when closed
            maxWidth={512} // Maximum width allowed for resizing
            enable={{
                // Define which resize handles are enabled
                left: anchor === "RIGHT", // Right sidebar can be resized from its left edge
                right: anchor === "LEFT", // Left sidebar can be resized from its right edge
            }}
            style={{
                // Grid column placement based on anchor
                gridColumn: anchor === "LEFT" ? "2 / 3" : "4 / 5",
            }}
            size={{ width: isOpened ? "16rem" : 0 }} // Initial size: 16rem (256px) when open, 0 when closed
        >
            {children}{" "}
            {/* Render the children passed to the Sidebar component */}
        </Resizable>
    );
}

export default Sidebar;
