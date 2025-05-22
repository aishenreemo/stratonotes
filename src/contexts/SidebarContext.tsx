import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

/**
 * @description Defines the possible anchoring positions for a sidebar: either to the 'LEFT' or 'RIGHT'.
 */
export type SidebarAnchor = "LEFT" | "RIGHT";

/**
 * @description Defines the type of action that can be performed on a sidebar's state.
 * Currently, only 'TOGGLE_OPENED' is supported.
 */
type SidebarActionType = "TOGGLE_OPENED";

/**
 * @interface SidebarAction
 * @description Represents an action to be dispatched to the sidebar reducer.
 * @property {SidebarAnchor} anchor - Specifies which sidebar (LEFT or RIGHT) the action applies to.
 * @property {SidebarActionType} type - The type of action to perform, e.g., 'TOGGLE_OPENED'.
 */
interface SidebarAction {
    anchor: SidebarAnchor;
    type: SidebarActionType;
}

/**
 * @interface SidebarState
 * @description Represents the state managed by the sidebar reducer.
 * @property {boolean} isLeftOpened - Indicates whether the left sidebar is currently open.
 * @property {boolean} isRightOpened - Indicates whether the right sidebar is currently open.
 */
interface SidebarState {
    isLeftOpened: boolean;
    isRightOpened: boolean;
}

/**
 * @interface SidebarContextType
 * @description Defines the shape of the object provided by the SidebarContext.
 * @property {SidebarState} state - The current state of both sidebars.
 * @property {Dispatch<SidebarAction>} dispatch - The dispatch function to send actions to the sidebar reducer.
 */
interface SidebarContextType {
    state: SidebarState;
    dispatch: Dispatch<SidebarAction>;
}

/**
 * sidebarReducer
 * @description A reducer function that manages the open/closed state of the left and right sidebars.
 * It handles the 'TOGGLE_OPENED' action for a specified sidebar anchor.
 *
 * @param {SidebarState} state - The current state of the sidebars.
 * @param {SidebarAction} action - The action to be performed on the sidebar state.
 * @returns {SidebarState} The new state after applying the action.
 */
function sidebarReducer(
    state: SidebarState,
    action: SidebarAction
): SidebarState {
    // Determine the current opened state of the target sidebar
    const isOpened =
        action.anchor === "LEFT" ? state.isLeftOpened : state.isRightOpened;

    if (action.type === "TOGGLE_OPENED") {
        // Toggle the opened state of the specified sidebar
        return action.anchor === "LEFT"
            ? { ...state, isLeftOpened: !isOpened }
            : { ...state, isRightOpened: !isOpened };
    }

    return state; // Return current state for any unhandled action types
}

// Create the context with an initial undefined value. It will be provided by the SidebarProvider.
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/**
 * SidebarProvider Component
 *
 * @component
 * @description A React Context Provider that makes the sidebar's state and dispatch function
 * available to any descendant component. It initializes both sidebars to be closed by default.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the sidebar context.
 * @returns {React.Node} A Context Provider wrapping the children.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sidebarReducer, {
        isLeftOpened: false, // Left sidebar is closed by default
        isRightOpened: false, // Right sidebar is closed by default
    });

    return (
        <SidebarContext.Provider value={{ state, dispatch }}>
            {children}
        </SidebarContext.Provider>
    );
}

/**
 * useSidebar Hook
 *
 * @hook
 * @description A custom hook that allows any functional component to access the sidebar's
 * state and dispatch function from the `SidebarContext`. It ensures that the hook
 * is used within a `SidebarProvider`.
 *
 * @returns {SidebarContextType} An object containing the current sidebar state and the dispatch function.
 * @throws {Error} If `useSidebar` is called outside of a `SidebarProvider`.
 */
export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        // Corrected error message to be specific to this context
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return context;
}
