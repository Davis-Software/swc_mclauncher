import {useEffect} from "react";
import {getSettingSync} from "../utils/settings";
import {exposedFunctions} from "../utils/constants";

function handleConsoleOpened(){
    console.log("--- Dev Console Opened ---")
    if(getSettingSync("loggingActive") === true){
        console.log("Logging is active")
        console.info("You can disable logging in the settings")
        console.info("Console view started at " + new Date().toLocaleString())
    }else{
        console.log("Logging is not active")
    }
    console.log("--- Dev Console Opened ---")
}

function DevConsoleHelper(){
    useEffect(() => {
        exposedFunctions("ipc").on("window:devTools", handleConsoleOpened)
        return () => exposedFunctions("ipc").off("window:devTools")
    }, [])

    return null
}

export default DevConsoleHelper
