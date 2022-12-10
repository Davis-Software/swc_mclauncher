import React, {useEffect} from "react"
import {Box, Button, Collapse, Fade, LinearProgress, Modal, Typography} from "@mui/material";
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
    const [errorInfo, setErrorInfo] = React.useState<string>("")
    const [showError, setShowError] = React.useState<boolean>(false)
    const [showErrorInfo, setShowErrorInfo] = React.useState<boolean>(false)

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

        function handleInitGame(){
            setState(true)
            setErrorInfo("")
        }
        function handlePackageMode(){
            setLoadingState("query")
            setInfo("Preparing package install...")
        }
        function handlePackageInstall(){
            setLoadingState("determinate")
            setInfo("Getting package...")
        }
        function handlePackageExtract(){
            setState(true)
        }
        function handleGameLaunched(){
            setLoadingState("determinate")
            setProgress(100)
            setInfo("Game launched!")
            setTimeout(() => setState(false), 2500)
        }
        function handleGameLaunchError(e: string){
            logger.error(e)
            setError(<>
                Game launch error.<br />{e} <br /><br /><br />Please check the console for more information. (Ctrl + Shift + I)
            </>)
            setShowError(true)
            setState(false)
        }
        function handleClose(exitCode: number | null){
            setState(false)
            if(exitCode === 0) return
            if(exitCode === null){
                setError(<>
                    Game exited unexpectedly. <br /><br /><br />Please check the console for more information. (Ctrl + Shift + I)
                </>)
            }else{
                setError(<>
                    Game exited with code {exitCode}. <br />Is your Java version compatible with this version? <br /><br /><br />Please check the console for more information. (Ctrl + Shift + I)
                </>)
            }
            setShowError(true)
        }

        function handleDownloadStatus(e: McLcDownloadStatus){
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
        }
        function handleProgress(e: McLcProgress){
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
        }

        function handleArguments(m: string){
            logger.info(m)
        }
        function handleDebug(m: string){
            logger.debug(m)
        }
        function handleData(m: string){
            setErrorInfo(m)
            logger.log(m)
        }

        exposedFunctions("mc").on("initGame", handleInitGame)
        exposedFunctions("mc").on("packageMode", handlePackageMode)
        exposedFunctions("mc").on("packageInstall", handlePackageInstall)
        exposedFunctions("mc").on("package-extract", handlePackageExtract)
        exposedFunctions("mc").on("gameLaunched", handleGameLaunched)
        exposedFunctions("mc").on("gameLaunchError", handleGameLaunchError)
        exposedFunctions("mc").on("close", handleClose)

        exposedFunctions("mc").on("download-status", handleDownloadStatus)
        exposedFunctions("mc").on("progress", handleProgress)

        exposedFunctions("mc").on("arguments", handleArguments)
        exposedFunctions("mc").on("debug", handleDebug)
        exposedFunctions("mc").on("data", handleData)

        return () => {
            exposedFunctions("mc").off("initGame")
            exposedFunctions("mc").off("packageMode")
            exposedFunctions("mc").off("packageInstall")
            exposedFunctions("mc").off("package-extract")
            exposedFunctions("mc").off("gameLaunched")
            exposedFunctions("mc").off("gameLaunchError")
            exposedFunctions("mc").off("close")

            exposedFunctions("mc").off("download-status")
            exposedFunctions("mc").off("progress")

            exposedFunctions("mc").off("arguments")
            exposedFunctions("mc").off("debug")
            exposedFunctions("mc").off("data")
        }
    }, [])

    return (
        <>
            <Modal
                disableEnforceFocus
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
                            p: 4,
                            outline: "none !important"
                        }}
                    >
                        <Typography id="transition-modal-title" variant="h6" component="h2">Launch Error</Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>{error}</Typography>
                        {errorInfo !== "" && (
                            <>
                                <Collapse
                                    in={showErrorInfo}
                                >
                                    <div className="my-2 p-2 bg-dark">{errorInfo}</div>
                                </Collapse>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        setShowErrorInfo(!showErrorInfo)
                                    }}
                                >
                                    {showErrorInfo ? "Show less" : "Show more"}
                                </Button>
                            </>
                        )}
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
