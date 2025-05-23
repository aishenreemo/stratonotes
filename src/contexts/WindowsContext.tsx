import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

type WindowsAction = { type: "TOGGLE_OPENED"; payload: number };

interface WindowsState {
    isOpened: boolean[];
}

interface WindowsContextType {
    state: WindowsState;
    dispatch: Dispatch<WindowsAction>;
}

function windowsReducer(
    state: WindowsState,
    action: WindowsAction
): WindowsState {
    const isOpened = [...state.isOpened];
    if (action.type === "TOGGLE_OPENED") {
        isOpened[action.payload] = !state.isOpened[action.payload];
        return {
            ...state,
            isOpened,
        };
    }

    return state;
}

const WindowsContext = createContext<WindowsContextType | undefined>(undefined);

export function WindowsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(windowsReducer, {
        isOpened: [false, false, false],
    });

    return (
        <WindowsContext.Provider value={{ state, dispatch }}>
            {children}
        </WindowsContext.Provider>
    );
}

export function useWindows() {
    const context = useContext(WindowsContext);

    if (!context) {
        // Corrected error message to be specific to this context
        throw new Error("useSidebar must be used within a SidebarProvider");
    }

    return context;
}
