import {
    createContext,
    useReducer,
    Dispatch,
    ReactNode,
    useContext,
} from "react";

/**
 * @typedef {'SOURCE' | 'READING'} EditorMode
 * @description Represents the two possible modes for the editor:
 * - 'SOURCE': The editor displays the raw markdown text for editing.
 * - 'READING': The editor displays a rendered preview of the markdown content.
 */
type EditorMode = "SOURCE" | "READING";

/**
 * @typedef {object} EditorAction
 * @description Defines the possible actions that can be dispatched to the editor reducer.
 * - `SET_CONTENT`: Sets the entire content of the editor.
 * @property {'SET_CONTENT'} type - The action type.
 * @property {String} payload - The new content to set.
 * - `ADD_CONTENT`: Appends content to the existing editor content, separated by two newlines.
 * @property {'ADD_CONTENT'} type - The action type.
 * @property {String} payload - The content to append.
 * - `SET_MODE`: Sets the editor's mode to either 'SOURCE' or 'READING'.
 * @property {'SET_MODE'} type - The action type.
 * @property {EditorMode} payload - The new mode to set.
 * - `TOGGLE_MODE`: Toggles the editor's mode between 'SOURCE' and 'READING'.
 * @property {'TOGGLE_MODE'} type - The action type.
 * @property {undefined} [payload] - No payload is needed for this action.
 */
type EditorAction =
    | { type: "SET_CONTENT"; payload: String }
    | { type: "ADD_CONTENT"; payload: String }
    | { type: "SET_MODE"; payload: EditorMode }
    | { type: "TOGGLE_MODE"; payload?: undefined };

/**
 * @interface EditorState
 * @description Represents the state managed by the editor reducer.
 * @property {EditorMode} mode - The current display mode of the editor ('SOURCE' or 'READING').
 * @property {String} content - The markdown content currently loaded in the editor.
 */
interface EditorState {
    mode: EditorMode;
    content: String;
}

/**
 * editorReducer
 * @description A reducer function that manages the state of the editor.
 * It handles actions to set content, add content, set the display mode,
 * and toggle the display mode.
 *
 * @param {EditorState} state - The current state of the editor.
 * @param {EditorAction} action - The action to be performed on the state.
 * @returns {EditorState} The new state after applying the action.
 */
function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case "SET_MODE":
            return { ...state, mode: action.payload };
        case "SET_CONTENT":
            return { ...state, content: action.payload };
        case "ADD_CONTENT":
            return {
                ...state,
                content: `${state.content}\n\n${action.payload}`,
            };
        case "TOGGLE_MODE":
            return {
                ...state,
                mode: state.mode === "SOURCE" ? "READING" : "SOURCE",
            };
        default:
            return state;
    }
}

/**
 * @interface EditorContextType
 * @description Defines the shape of the object provided by the EditorContext.
 * @property {EditorState} state - The current state of the editor.
 * @property {Dispatch<EditorAction>} dispatch - The dispatch function to send actions to the editor reducer.
 */
interface EditorContextType {
    state: EditorState;
    dispatch: Dispatch<EditorAction>;
}

// Create the context with an initial undefined value. It will be provided by the EditorProvider.
const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * EditorProvider Component
 *
 * @component
 * @description A React Context Provider that makes the editor's state and dispatch function
 * available to any descendant component. It initializes the editor with a default `READING`
 * mode and empty content.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the editor context.
 * @returns {React.Node} A Context Provider wrapping the children.
 */
export function EditorProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(editorReducer, {
        mode: "READING", // Initial mode is 'READING'
        content: "", // Initial content is an empty string
    });

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
}

/**
 * useEditor Hook
 *
 * @hook
 * @description A custom hook that allows any functional component to access the editor's
 * state and dispatch function from the `EditorContext`. It ensures that the hook
 * is used within an `EditorProvider`.
 *
 * @returns {EditorContextType} An object containing the current editor state and the dispatch function.
 * @throws {Error} If `useEditor` is called outside of an `EditorProvider`.
 */
export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}
