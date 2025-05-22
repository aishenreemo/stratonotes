import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

/**
 * @typedef {'FETCH_NOTES' | 'OPEN_NOTE'} ExplorerActionType
 * @description Defines the types of actions that can be dispatched to the explorer reducer.
 */
type ExplorerAction =
    | { type: "FETCH_NOTES"; payload: Note[] }
    | { type: "OPEN_NOTE"; payload: number }
    | { type: "SET_QUERY"; payload: string };
// | { type: "FILTER_NOTES"; payload: Note[]};

/**
 * @interface Note
 * @description Represents the structure of a note object within the application.
 * @property {String} [title] - The display title of the note (optional).
 * @property {String} path - The file path of the note.
 * @property {Date} created - The creation timestamp of the note.
 * @property {Date} updated - The last updated timestamp of the note.
 */
export interface Note {
    title?: String;
    path: String;
    created: Date;
    updated: Date;
}

/**
 * @interface ExplorerState
 * @description Represents the state managed by the explorer reducer.
 * @property {Note[]} files - An array of all available notes.
 * @property {Note} [selectedFile] - The currently selected note, if any.
 */
interface ExplorerState {
    files: Note[];
    selectedFile?: Note;
    query: string;
}

/**
 * @interface ExplorerContextType
 * @description Defines the shape of the object provided by the ExplorerContext.
 * @property {ExplorerState} state - The current state of the explorer.
 * @property {Dispatch<ExplorerAction>} dispatch - The dispatch function to send actions to the explorer reducer.
 */
interface ExplorerContextType {
    state: ExplorerState;
    dispatch: Dispatch<ExplorerAction>;
}

/**
 * explorerReducer
 * @description A reducer function that manages the state of the file explorer.
 * It handles actions to fetch notes and to open (select) a specific note.
 *
 * @param {ExplorerState} state - The current state of the explorer.
 * @param {ExplorerAction} action - The action to be performed on the state.
 * @returns {ExplorerState} The new state after applying the action.
 */
function explorerReducer(state: ExplorerState, action: ExplorerAction) {
    switch (action.type) {
        case "FETCH_NOTES":
            return {
                ...state,
                files: action.payload,
            };
        case "OPEN_NOTE":
            // If payload is -1, deselect any currently open note
            if (action.payload === -1) {
                return {
                    ...state,
                    selectedFile: undefined,
                };
            }
            // If payload is a valid index, select the corresponding note from the files array
            if (action.payload < state.files.length) {
                return {
                    ...state,
                    selectedFile: state.files[action.payload],
                };
            }
            return state; // Return current state if index is out of bounds

        case "SET_QUERY":
            return {
                ...state,
                query: action.payload.toLowerCase(),
            };

        default:
            return state; // Return current state for unknown action types
    }
}

// Create the context with an initial undefined value. It will be provided by the ExplorerProvider.
const ExplorerContext = createContext<ExplorerContextType | undefined>(
    undefined
);

/**
 * ExplorerProvider Component
 *
 * @component
 * @description A React Context Provider that makes the explorer's state and dispatch function
 * available to any descendant component. It initializes the explorer with no selected file
 * and an empty array of files.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the explorer context.
 * @returns {React.Node} A Context Provider wrapping the children.
 */
export function ExplorerProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(explorerReducer, {
        selectedFile: undefined, // No file selected initially
        files: [], // Empty array of files initially
        query: "", // Query is set to blank initially
    });

    return (
        <ExplorerContext.Provider value={{ state, dispatch }}>
            {children}
        </ExplorerContext.Provider>
    );
}

/**
 * useExplorer Hook
 *
 * @hook
 * @description A custom hook that allows any functional component to access the explorer's
 * state and dispatch function from the `ExplorerContext`. It ensures that the hook
 * is used within an `ExplorerProvider`.
 *
 * @returns {ExplorerContextType} An object containing the current explorer state and the dispatch function.
 * @throws {Error} If `useExplorer` is called outside of an `ExplorerProvider`.
 */
export function useExplorer() {
    const context = useContext(ExplorerContext);

    if (!context) {
        // This error message seems to be a copy-paste from useEditor,
        // it should ideally be "useExplorer must be used within an ExplorerProvider".
        throw new Error("useEditor must be used within an EditorProvider");
    }

    return context;
}
