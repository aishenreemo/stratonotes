import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

type EditorMode = "SOURCE" | "READING";
type EditorModeAction =
    | { type: "SET_MODE"; payload: EditorMode }
    | { type: "TOGGLE_MODE"; payload?: undefined };

interface EditorModeState {
    mode: EditorMode; // State now tracks the current mode
}

function editorModeReducer(
    state: EditorModeState,
    action: EditorModeAction
): EditorModeState {
    if (action.type == "SET_MODE") {
        return { ...state, mode: action.payload };
    } else if (action.type == "TOGGLE_MODE") {
        return {
            ...state,
            mode: state.mode === "SOURCE" ? "READING" : "SOURCE",
        };
    }

    return state;
}

interface EditorModeContextType {
    state: EditorModeState;
    dispatch: Dispatch<EditorModeAction>;
}

export function EditorModeProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(editorModeReducer, {
        mode: "READING",
    });

    return (
        <EditorModeContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorModeContext.Provider>
    );
}

const EditorModeContext = createContext<EditorModeContextType | undefined>(
    undefined
);

export function useEditorMode() {
    const context = useContext(EditorModeContext);
    if (!context) {
        throw new Error(
            "useEditorMode must be used within an EditorModeProvider"
        );
    }
    return context;
}
