import React, {useEffect} from "react"
import {LinearProgress} from "@mui/material";
import {exposedFunctions} from "../utils/constants";
import {McLcDownloadStatus, McLcProgress} from "../types/McLcResponses";

interface LaunchProgressPaneProps{
    setLaunching: (launching: boolean) => void
}
function LaunchProgressPane(props: LaunchProgressPaneProps){
    const [loadingState, setLoadingState] = React.useState<"query" | "buffer" | "determinate" | "indeterminate" | undefined>("query")
    const [progress, setProgress] = React.useState<number>(0)
    const [buffer, setBuffer] = React.useState<number>(10)
    const [info, setInfo] = React.useState<string>("Starting up...")

    function setState(val: boolean){
        props.setLaunching(val)

        if(val){
            setLoadingState("query")
            setProgress(0)
            setBuffer(10)
            setInfo("Calling Java...")
        }
    }

    useEffect(() => {
        exposedFunctions("mc").on("initGame", () => setState(true))
        exposedFunctions("mc").on("gameLaunched", () => {
            setLoadingState("determinate")
            setProgress(100)
            setInfo("Game launched!")
            setTimeout(() => setState(false), 2500)
        })
        exposedFunctions("mc").on("gameLaunchError", () => setState(false))
        exposedFunctions("mc").on("close", () => setState(false))

        exposedFunctions("mc").on("download-status", (e: McLcDownloadStatus) => {
            if(e.type === "native") return
            setBuffer(e.current / e.total * 100)
        })
        exposedFunctions("mc").on("progress", (e: McLcProgress) => {
            switch (e.type){
                case "natives":
                    setLoadingState("query")
                    setInfo("Downloading natives...")
                    break
                case "classes":
                case "assets":
                    setLoadingState("buffer")
                    setInfo(`Downloading ${e.type}... (${e.task}/${e.total})`)
                    setProgress(e.task / e.total * 100)
                    break
            }
        })

        exposedFunctions("mc").on("arguments", console.info)
        exposedFunctions("mc").on("debug", console.debug)
        exposedFunctions("mc").on("data", console.log)
    }, [])

    return (
        <div className="launch-progress-pane">
            <LinearProgress variant={loadingState} value={progress} valueBuffer={buffer} />
            <span className="info-text">{info}</span>
        </div>
    )
}

export default LaunchProgressPane
