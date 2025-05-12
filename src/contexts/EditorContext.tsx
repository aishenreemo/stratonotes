import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

type EditorMode = "SOURCE" | "READING";
type EditorAction =
    | { type: "SET_CONTENT"; payload: String }
    | { type: "SET_MODE"; payload: EditorMode }
    | { type: "TOGGLE_MODE"; payload?: undefined };

interface EditorState {
    mode: EditorMode;
    content: String;
}

function editorReducer(
    state: EditorState,
    action: EditorAction
): EditorState {
    if (action.type == "SET_MODE") {
        return { ...state, mode: action.payload };
    } else if (action.type == "SET_CONTENT") {
        return { ...state, content: action.payload };
    } else if (action.type == "TOGGLE_MODE") {
        return {
            ...state,
            mode: state.mode === "SOURCE" ? "READING" : "SOURCE",
        };
    }

    return state;
}

interface EditorContextType {
    state: EditorState;
    dispatch: Dispatch<EditorAction>;
}

export function EditorProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(editorReducer, {
        mode: "READING",
        content: "",
    });

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
}

const EditorContext = createContext<EditorContextType | undefined>(
    undefined
);

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error(
            "useEditor must be used within an EditorProvider"
        );
    }
    return context;
}
