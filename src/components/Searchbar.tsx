import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useExplorer } from "../contexts/ExplorerContext";

/**
 * A search bar component that allows users to filter and find notes.
 *
 * @component
 * @returns {React.ReactNode} Returns a div element containing a text input for search and a search icon.
 */
function Searchbar(): React.ReactNode {
    const [query, setQuery] = useState<string>("");
    const explorer = useExplorer();

    useEffect(
        () => explorer.dispatch({ type: "SET_QUERY", payload: query }),
        [query]
    );

    return (
        <div className="bg-white/50 p-1 m-1 w-auto h-10 flex items-center relative rounded-2xl shadow-sm shadow-gray-500/50">
            <MdSearch className="absolute left-2" />
            <input
                placeholder="Search..."
                type="text"
                className="pl-8 pr-2 outline-none w-full"
                id="searchbar"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQuery(e.target.value)
                }
            />
        </div>
    );
}

export default Searchbar;
