import React, {useEffect} from "react"
import PageBase from "./PageBase";
import Pane from "../components/Pane";
import {LaunchBarCustomContent, LaunchBarListContent} from "../components/LaunchBarComponents";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {McLcVersionType, McVersionResponseType, McVersionType} from "../types/mcVersionType";
import {getSetting} from "../utils/settings";
import {loadMCVersions} from "../utils/info-loader";
import {compareVersions, validate} from "compare-versions";
import {exposedFunctions} from "../utils/constants";

function MinecraftVanillaLaunchBar(){
    const [ramSetting, setRamSetting] = React.useState<number>(0)
    const [mcVersionsData, setMcVersionsData] = React.useState<McVersionResponseType | null>(null)
    const [mcVersions, setMcVersions] = React.useState<McVersionType[]>([])
    const [version, setVersion] = React.useState<string>("")

    const [versionDropdownOpen, setVersionDropdownOpen] = React.useState<boolean>(false)

    useEffect(() => {
        loadMCVersions().then(setMcVersionsData)
        getSetting("ram").then(setRamSetting)
    }, [])
    useEffect(() => {
        if(!mcVersionsData) return

        let versions: McVersionType[] = []

        for(let versionType of ["release", "snapshot", "old_beta", "old_alpha"]){
            let vs = mcVersionsData.versions.filter((version: McVersionType) => version.type === versionType)
            vs.sort((a: McVersionType, b: McVersionType) => {
                return (validate(a.id) && validate(b.id)) ? compareVersions(b.id, a.id) : 0
            }).forEach((version: McVersionType) => versions.push(version))
        }

        setMcVersions(versions)
        setVersion(localStorage.getItem("vanillaMcVersion") || "")
    }, [mcVersionsData])
    useEffect(() => {
        if(version === "") return
        localStorage.setItem("vanillaMcVersion", version)
    }, [version])

    function handleVersionChange(event: SelectChangeEvent) {
        setVersion(event.target.value as string);
    }

    function handleButtonClick(){
        let versionInfo: McLcVersionType = {
            number: version,
            type: mcVersions.find((v: McVersionType) => v.id === version)!.type
        }
        exposedFunctions("mc").launchVanilla(versionInfo)
    }

    function MenuItemContent({version}: {version: McVersionType}){
        let colors = {
            release: "text-success",
            snapshot: "text-info",
            old_beta: "text-warning",
            old_alpha: "text-danger"
        }

        return (
            <>
                <span>{version.id}{versionDropdownOpen && <span style={{color: "transparent"}}> {version.type}</span>}</span>
                {versionDropdownOpen &&
                    <span
                        className={colors[version.type]}
                        style={{position: "absolute", right: "15px"}}
                    >
                        {version.type}
                    </span>
                }
            </>
        )
    }

    return (
        <>
            <LaunchBarCustomContent>
                <FormControl variant="standard" sx={{minWidth: "60%", maxWidth: "90%"}}>
                    <InputLabel id="mc-vanilla-version-select">Minecraft Version</InputLabel>
                    <Select
                        labelId="mc-vanilla-version-select"
                        id="mc-vanilla-version-select"
                        value={version}
                        onChange={handleVersionChange}
                        onOpen={() => setVersionDropdownOpen(true)}
                        onClose={() => setVersionDropdownOpen(false)}
                    >
                        {mcVersions.map((version, index) => (
                            <MenuItem className="attach-candle" value={version.id} key={index}>
                                <MenuItemContent version={version} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </LaunchBarCustomContent>

            <LaunchBarCustomContent>
                <Button
                    variant="outlined"
                    sx={{height: "100%"}}
                    disabled={version === ""}
                    color="success"
                    fullWidth
                    className="attach-candle btn-outline-success"
                    onClick={handleButtonClick}
                >
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
