import React, {useEffect} from "react"
import PageBase from "./PageBase";
import {LaunchBarCustomContent, LaunchBarListContent} from "../components/LaunchBarComponents";
import {Button, Tooltip} from "@mui/material";
import {getSetting} from "../utils/settings";
import {exposedFunctions} from "../utils/constants";
import {ModPackType} from "../types/modPackType";
import Pane from "../components/Pane";
import {compare} from "compare-versions"

interface ModPackLaunchBarProps {
    modPack: ModPackType
}
function ModPackLaunchBar(props: ModPackLaunchBarProps){
    const [ramSetting, setRamSetting] = React.useState<number>(0)
    const [javaVersion, setJavaVersion] = React.useState<string>("")
    const [javaVersionMalCompliant, setJavaVersionMalCompliant] = React.useState<boolean>(false)

    const [javaPath, setJavaPath] = React.useState<string>("")
    const [javaVersions, setJavaVersions] = React.useState<{path: string, version: string, jdk: boolean}[]>([])

    useEffect(() => {
        getSetting("ram").then(setRamSetting)
        getSetting("javaPath").then(setJavaPath)
        getSetting("javaPaths").then(setJavaVersions)
    }, [])
    useEffect(() => {
        const javaVersionIndex = javaVersions.findIndex(v => v.path === javaPath)
        if(javaVersionIndex === -1) {
            setJavaVersionMalCompliant(false)
            return
        }
        setJavaVersion(javaVersions[javaVersionIndex].version.split("_")[0])
    }, [javaPath, javaVersions])
    useEffect(() => {
        if(javaVersion === "") return
        setJavaVersionMalCompliant(!!props.modPack.minJavaVersion &&
            compare(props.modPack.minJavaVersion, javaVersion, ">"))
    }, [javaVersion])

    function handleButtonClick(){
        exposedFunctions("mc").launchModded(props.modPack)
    }

    return (
        <>
            <LaunchBarListContent>
                <li>Version: {props.modPack.version}</li>
                <li>MC Version: {props.modPack.mcVersion}</li>
            </LaunchBarListContent>

            <LaunchBarCustomContent>
                <Tooltip
                    title={javaVersionMalCompliant ?
                        `The minimum required java version is "${props.modPack.minJavaVersion}". 
                        \nPlease select the appropriate version in Settings.` : ""}
                    placement="top"
                >
                    <div className="w-100 h-100">
                        <Button
                            variant="outlined"
                            sx={{height: "100%"}}
                            color="success"
                            fullWidth
                            className="attach-candle btn-outline-success"
                            onClick={handleButtonClick}
                            disabled={!javaVersion || javaVersionMalCompliant}
                        >
                            Play
                        </Button>
                    </div>
                </Tooltip>
            </LaunchBarCustomContent>

            <LaunchBarListContent right>
                <li>Mod Loader: {props.modPack.type}</li>
                <li>Memory: {(ramSetting / 1024).toFixed(1)}GB</li>
            </LaunchBarListContent>
        </>
    )
}

interface ModPackProps {
    modPack: ModPackType
}
function ModPack(props: ModPackProps) {
    return (
        <PageBase bgImage={props.modPack["bg-picture"]}>
            <div style={{textAlign: "center", marginTop: "10vh"}}>
                <Pane dark>
                    <div className="mb-5 pt-5">
                        {props.modPack.icon && props.modPack.icon !== "" &&
                            <img className="w-75" src={props.modPack.icon} alt={props.modPack.name} style={{maxHeight: "23vh", objectFit: "contain"}} />
                        }
                        <h3 style={{fontFamily: "MinecraftEvenings"}}>{props.modPack.name}</h3>
                        {props.modPack.desc && props.modPack.desc !== "" && <p>{props.modPack.desc}</p>}
                        <span className="float-end">{props.modPack.creator}</span>
                    </div>
                </Pane>
            </div>
        </PageBase>
    )
}

export default ModPack;
export {ModPackLaunchBar};
