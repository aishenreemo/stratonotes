import { MdSearch } from "react-icons/md";

function Searchbar() {
  return (
    <div className="grid grid-cols-4 gap-1 w-auto h-10 border p-1 border-black">
      <input placeholder="Search..." type="text" className="flex-grow col-span-3">
      </input>
      <button className="col-span-1 flex justify-center items-center">
        <MdSearch />
      </button>
    </div>
  )
}

export default Searchbar
