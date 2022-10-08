import React, {useEffect} from "react"
import PageBase from "./PageBase";
import {LaunchBarCustomContent, LaunchBarListContent} from "../components/LaunchBarComponents";
import {Button} from "@mui/material";
import {getSetting} from "../utils/settings";
import {exposedFunctions} from "../utils/constants";
import {ModPackType} from "../types/modPackType";
import Pane from "../components/Pane";

interface ModPackLaunchBarProps {
    modPack: ModPackType
}
function ModPackLaunchBar(props: ModPackLaunchBarProps){
    const [ramSetting, setRamSetting] = React.useState<number>(0)

    useEffect(() => {
        getSetting("ram").then(setRamSetting)
    }, [])

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
                <Button
                    variant="outlined"
                    sx={{height: "100%"}}
                    color="success"
                    fullWidth
                    className="attach-candle btn-outline-success"
                    onClick={handleButtonClick}
                >
                    Play
                </Button>
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
