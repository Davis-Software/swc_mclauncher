import React, {useEffect} from "react"
import {Box, Fade, LinearProgress, Modal, Typography} from "@mui/material";
import {exposedFunctions} from "../utils/constants";
import {McLcDownloadStatus, McLcProgress} from "../types/McLcResponses";
import Logger from "../utils/logger";

interface LaunchProgressPaneProps{
    setLaunching: (launching: boolean) => void
}
function LaunchProgressPane(props: LaunchProgressPaneProps){
    const [loadingState, setLoadingState] = React.useState<"query" | "buffer" | "determinate" | "indeterminate" | undefined>("query")
    const [progress, setProgress] = React.useState<number>(0)
    const [buffer, setBuffer] = React.useState<number>(10)
    const [info, setInfo] = React.useState<string>("Starting up...")

    const [error, setError] = React.useState<React.ReactNode | null>(null)
    const [showError, setShowError] = React.useState<boolean>(false)

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
        const logger = new Logger()

        exposedFunctions("mc").on("initGame", () => setState(true))
        exposedFunctions("mc").on("packageMode", () => {
            setLoadingState("query")
            setInfo("Preparing package install...")
        })
        exposedFunctions("mc").on("packageInstall", () => {
            setLoadingState("determinate")
            setInfo("Getting package...")
        })
        exposedFunctions("mc").on("package-extract", () => setState(true))
        exposedFunctions("mc").on("gameLaunched", () => {
            setLoadingState("determinate")
            setProgress(100)
            setInfo("Game launched!")
            setTimeout(() => setState(false), 2500)
        })
        exposedFunctions("mc").on("gameLaunchError", (e: string) => {
            logger.error(e)
            setError(<>
                Game launch error.<br />{e} <br /><br /><br />Please check the console for more information. (Ctrl + Shift + I)
            </>)
            setShowError(true)
            setState(false)
        })
        exposedFunctions("mc").on("close", (exitCode: number) => {
            setState(false)
            if(exitCode === 0) return
            setError(<>
                Game exited with code {exitCode}. <br />Is your Java version compatible with this version? <br /><br /><br />Please check the console for more information. (Ctrl + Shift + I)
            </>)
            setShowError(true)
        })

        exposedFunctions("mc").on("download-status", (e: McLcDownloadStatus) => {
            if(e.type === "native") return
            if(e.type === "client-package"){
                setProgress(e.current / e.total * 100)
                if(e.current === e.total) {
                    setLoadingState("indeterminate")
                    setInfo("Extracting package...")
                }
                return
            }
            setBuffer(e.current / e.total * 100)
        })
        exposedFunctions("mc").on("progress", (e: McLcProgress) => {
            switch (e.type){
                case "natives":
                    setLoadingState("query")
                    setInfo("Downloading natives...")
                    break
                case "classes-custom":
                    setLoadingState("buffer")
                    setInfo(`Downloading custom classes... (${e.task}/${e.total})`)
                    setProgress(e.task / e.total * 100)
                    break
                case "classes":
                case "assets":
                case "forge":
                    setLoadingState("buffer")
                    setInfo(`Downloading ${e.type}... (${e.task}/${e.total})`)
                    setProgress(e.task / e.total * 100)
                    break
            }
        })

        exposedFunctions("mc").on("arguments", logger.info)
        exposedFunctions("mc").on("debug", logger.debug)
        exposedFunctions("mc").on("data", logger.log)
    }, [])

    return (
        <>
            <Modal
                open={showError}
                onClose={() => setShowError(false)}
                closeAfterTransition
                componentsProps={{
                    // ignoring since it's a bug in the typings
                    // @ts-ignore
                    backdrop: {timeout: 500}
                }}
            >
                <Fade in={showError}>
                    <Box
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 800,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4
                        }}
                    >
                        <Typography id="transition-modal-title" variant="h6" component="h2">Launch Error</Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>{error}</Typography>
                    </Box>
                </Fade>
            </Modal>
            <div className="launch-progress-pane">
                <LinearProgress variant={loadingState} value={progress} valueBuffer={buffer} />
                <span className="info-text">{info}</span>
            </div>
        </>
    )
}

export default LaunchProgressPane
