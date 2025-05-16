import { invoke } from "@tauri-apps/api/core";
import { info, error } from "@tauri-apps/plugin-log";

function Summarizer() {
  return (
    <div className="m-1 p-1 border border-black items-center w-auto h-20 flex flex-col">
        <h1>Note Summary</h1>
        <hr className="flex flex-grow justify-center items-center"></hr>
        <button className="flex flex-grow justify-center items-center"
        onClick={async () =>{
                    invoke("prompt").then(() => {
                        info(`prompted.`);
                    }).catch(error);
                }}>Summarize!!</button>
    </div>
  )
}

export default Summarizer
