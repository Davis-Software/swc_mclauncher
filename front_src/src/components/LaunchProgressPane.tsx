import React, {useEffect} from "react"
import {LinearProgress} from "@mui/material";

interface LaunchProgressPaneProps{
    setDisabled: (disabled: boolean) => void
}
function LaunchProgressPane(props: LaunchProgressPaneProps){
    const [loadingState, setLoadingState] = React.useState<"query" | "buffer" | "determinate" | "indeterminate" | undefined>("query")
    const [progress, setProgress] = React.useState<number>(0)
    const [buffer, setBuffer] = React.useState<number>(10)
    const [info, setInfo] = React.useState<string>("Starting up...")

    useEffect(() => {
        // setLoadingState("indeterminate")
    }, [])

    return (
        <div className="launch-progress-pane">
            <LinearProgress variant={loadingState} value={progress} valueBuffer={buffer} />
            <span className="info-text">{info}</span>
        </div>
    )
}

export default LaunchProgressPane
