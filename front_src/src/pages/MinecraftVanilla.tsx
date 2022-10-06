import React, {useEffect} from "react"
import PageBase from "./PageBase";
import Pane from "../components/Pane";
import {LaunchBarCustomContent, LaunchBarListContent} from "../components/LaunchBarComponents";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {McVersionResponseType} from "../types/mcVersionType";
import {getSetting} from "../utils/settings";
import {loadMCVersions} from "../utils/info-loader";

function MinecraftVanillaLaunchBar(){
    const [ramSetting, setRamSetting] = React.useState<number>(0)
    const [mcVersionsData, setMcVersionsData] = React.useState<McVersionResponseType | null>(null)
    const [version, setVersion] = React.useState<string>("")

    useEffect(() => {
        loadMCVersions().then((data: McVersionResponseType) => {
            setMcVersionsData(data)
            setVersion(localStorage.getItem("vanillaMcVersion") || "")
        })
        getSetting("ram").then(setRamSetting)
    }, [])
    useEffect(() => {
        if(version !== ""){
            localStorage.setItem("vanillaMcVersion", version)
        }
    }, [version])

    function handleVersionChange(event: SelectChangeEvent) {
        setVersion(event.target.value as string);
    }

    return (
        <>
            <LaunchBarCustomContent>
                <FormControl variant="filled" sx={{minWidth: "60%", maxWidth: "90%"}}>
                    <InputLabel id="mc-vanilla-version-select">Minecraft Version</InputLabel>
                    <Select
                        labelId="mc-vanilla-version-select"
                        id="mc-vanilla-version-select"
                        value={version}
                        onChange={handleVersionChange}
                    >
                        {mcVersionsData?.versions.map((version, index) => (
                            <MenuItem value={version.id || "unset"} key={index}>
                                {version.type}: {version.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </LaunchBarCustomContent>

            <LaunchBarCustomContent>
                <Button variant="contained" color="success" sx={{height: "100%"}} disabled={version === ""} fullWidth>
                    {version === "" ? "Select a version" : "Play"}
                </Button>
            </LaunchBarCustomContent>

            <LaunchBarListContent right>
                <li>Version: {version !== "" ? version : "N/A"}</li>
                <li>Memory: {(ramSetting / 1024).toFixed(1)}GB</li>
            </LaunchBarListContent>
        </>
    )
}

function MinecraftVanilla(){
    return (
        <PageBase bgImage="../static/images/vanilla-bg.png">
            <div style={{textAlign: "center", marginTop: "10vh"}}>
                <Pane dark>
                    <div className="title jumbotron mb-5">
                        <img className="w-75" src="./../static/images/mc.png" alt="" />
                        <h3 style={{fontFamily: "MinecraftEvenings"}}>JAVA Edition</h3>
                        <span className="float-end">by Mojang</span>
                    </div>
                </Pane>
            </div>
        </PageBase>
    )
}

export default MinecraftVanilla
export { MinecraftVanillaLaunchBar }
