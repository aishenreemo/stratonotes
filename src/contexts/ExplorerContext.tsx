import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

type ExplorerAction =
    | { type: "FETCH_NOTES"; payload: String[] }
    | { type: "OPEN_NOTE"; payload: number };

interface ExplorerState {
    files: String[];
    selectedFile?: String;
}

interface ExplorerContextType {
    state: ExplorerState;
    dispatch: Dispatch<ExplorerAction>;
}

function explorerReducer(state: ExplorerState, action: ExplorerAction) {
    if (action.type == "FETCH_NOTES") {
        return {
            ...state,
            files: action.payload,
        };
    } else if (
        action.type == "OPEN_NOTE" &&
        action.payload < state.files.length
    ) {
        return {
            ...state,
            selectedFile: state.files[action.payload],
        };
    }

    return state;
}

export function ExplorerProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(explorerReducer, {
        selectedFile: undefined,
        files: [],
    });

    return (
        <ExplorerContext.Provider value={{ state, dispatch }}>
            {children}
        </ExplorerContext.Provider>
    );
}

const ExplorerContext = createContext<ExplorerContextType | undefined>(
    undefined
);

export function useExplorer() {
    const context = useContext(ExplorerContext);

    if (!context) {
        throw new Error(
            "useEditor must be used within an EditorProvider"
        );
    }

    return context;
}
