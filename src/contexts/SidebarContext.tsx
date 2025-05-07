import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

export type SidebarAnchor = "LEFT" | "RIGHT";
type SidebarActionType = "TOGGLE_OPENED";

interface SidebarAction {
    anchor: SidebarAnchor;
    type: SidebarActionType;
}

interface SidebarState {
    isLeftOpened: boolean;
    isRightOpened: boolean;
}

interface SidebarContextType {
    state: SidebarState;
    dispatch: Dispatch<SidebarAction>;
}

function sidebarReducer(state: SidebarState, action: SidebarAction) {
    let isOpened =
        action.anchor == "LEFT" ? state.isLeftOpened : state.isRightOpened;

    if (action.type == "TOGGLE_OPENED") {
        console.log(`${action.anchor}: ${!isOpened}`);
        return action.anchor == "LEFT"
            ? { ...state, isLeftOpened: !isOpened }
            : { ...state, isRightOpened: !isOpened };
    }

    return state;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(sidebarReducer, {
        isLeftOpened: false,
        isRightOpened: false,
    });

    return (
        <SidebarContext.Provider value={{ state, dispatch }}>
            {children}
        </SidebarContext.Provider>
    );
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error(
            "useEditorMode must be used within an EditorModeProvider"
        );
    }

    return context;
}
