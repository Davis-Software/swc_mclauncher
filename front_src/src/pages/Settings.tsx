import React, {useEffect} from "react";
import PageBase from "./PageBase";
import {Checkbox, FormControlLabel, MenuItem, Slider, TextField} from "@mui/material";
import {exposedFunctions} from "../utils/constants";
import {getSetting, getSettingBoolean, setSetting} from "../utils/settings";

interface SettingsInputProps {
    name: string
    type: "text" | "number" | "path" | "file" | "dropdown-file"
    value: string | number
    onChange: (value: string | number | null) => void
    debugMode?: boolean
}
function SettingsInput(props: SettingsInputProps){
    const id = `settings-input-${props.name.replace(/ /, "_").toLowerCase()}`

    function pathDialog(){
        return new Promise((resolve) => {
            exposedFunctions("dialog").showDialog({
                properties: ["openDirectory", "createDirectory", "dontAddToRecent"],
                defaultPath: props.value as string
            }).then((data: {canceled: boolean, filePaths: string[]}) => {
                if(data.canceled) {
                    resolve(null)
                }else{
                    props.onChange(data.filePaths[0])
                    resolve(data.filePaths[0])
                }
            })
        })
    }

    function fileDialog(){
        return new Promise((resolve) => {
            exposedFunctions("dialog").showDialog({
                properties: ["openFile", "createDirectory", "dontAddToRecent"],
                defaultPath: props.value as string,
                patterns: [
                    {name: "All Files", extensions: ["*"]}
                ]
            }).then((data: {canceled: boolean, filePaths: string[]}) => {
                if(data.canceled){
                    resolve(null)
                }else{
                    props.onChange(data.filePaths[0])
                    resolve(data.filePaths[0])
                }
            })
        })
    }

    function types(){
        switch(props.type){
            case "path":
                return (
                    <TextField
                        sx={{width: "100%"}}
                        variant="standard"
                        aria-labelledby={id}
                        type="text"
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        onClick={pathDialog}
                    />
                )
            case "dropdown-file":
                const [javaPaths, setJavaPaths] = React.useState<{path: string, version: string, jdk: boolean}[]>([])
                const [javaPathsItems, setJavaPathsItems] = React.useState<React.ReactNode[]>([])

                function handleClick(e: React.MouseEvent<HTMLLIElement>){
                    e.preventDefault()
                    fileDialog().then((path) => {
                        if(path === null){
                            props.onChange(javaPaths[0].path)
                        }
                    })
                }

                useEffect(() => {
                    getSetting("javaPaths").then(setJavaPaths)
                }, [])
                useEffect(() => {
                    let paths = javaPaths.map((path, index) => (
                        <MenuItem key={index} value={path.path}>
                            {path.version}
                            <span
                                className={path.jdk? "text-warning": "text-success"}
                                style={{position: "absolute", right: "25px"}}
                            >
                                {path.jdk ? "JDK" : "JRE"}
                            </span>
                        </MenuItem>
                    ))
                    if(props.debugMode){
                        paths.push(<MenuItem key={paths.length} value="custom" onClick={handleClick}>Custom (Buggy)</MenuItem>)
                    }
                    setJavaPathsItems(paths)
                }, [javaPaths, props.debugMode])

                return (
                    <TextField
                        sx={{width: "100%"}}
                        variant="standard"
                        aria-labelledby={id}
                        type="text"
                        value={javaPathsItems && javaPathsItems.length > 0 ? props.value : ""}
                        onChange={(e) => props.onChange(e.target.value)}
                        select
                    >
                        {javaPathsItems}
                    </TextField>
                )
            case "file":
                return (
                    <TextField
                        sx={{width: "100%"}}
                        variant="standard"
                        aria-labelledby={id}
                        type="text"
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                        onClick={fileDialog}
                    />
                )
            default:
                return (
                    <TextField
                        sx={{width: "100%"}}
                        variant="standard"
                        aria-labelledby={id}
                        type={props.type}
                        value={props.value}
                        onChange={(e) => props.onChange(e.target.value)}
                    />
                )
        }
    }

    return (
        <>
            <td className="pt-3">{props.name}</td>
            <td className="flex-grow-1">
                {types()}
            </td>
        </>
    )
}

interface SettingsCheckboxProps {
    name: string
    value: boolean
    onChange: (value: boolean) => void
}
function SettingsCheckbox(props: SettingsCheckboxProps){
    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        props.onChange(e.target.checked)
    }

    return (
        <div>
            <FormControlLabel control={<Checkbox checked={props.value} onChange={handleChange} />} label={props.name} />
        </div>
    )
}

function Settings(){
    const [ready, setReady] = React.useState(false)

    const [ramTotal, setRamTotal] = React.useState(99999);
    const [ramSelected, setRamSelected] = React.useState<number | null>(null);

    const [mcPath, setMcPath] = React.useState<string>("")
    const [javaPath, setJavaPath] = React.useState<string>("")

    const [width, setWidth] = React.useState<number>(1280)
    const [height, setHeight] = React.useState<number>(720)

    const [minimizeWhilePlaying, setMinimizeWhilePlaying] = React.useState<boolean>(false)
    const [closeOnGameExit, setCloseOnGameExit] = React.useState<boolean>(false)

    const [showSnapshots, setShowSnapshots] = React.useState<boolean>(false)
    const [showBetaAndAlpha, setShowBetaAndAlpha] = React.useState<boolean>(false)
    const [launchArgs, setLaunchArgs] = React.useState<string>("")
    const [debugLogging, setDebugLogging] = React.useState<boolean>(false)


    useEffect(() => {
        exposedFunctions("utils").getRAMAmount().then(setRamTotal)
        getSetting("ram").then(setRamSelected)

        getSetting("mcPath").then(setMcPath)
        getSetting("javaPath").then(setJavaPath)

        getSetting("splash-width").then(setWidth)
        getSetting("splash-height").then(setHeight)

        getSettingBoolean("minimize-while-playing").then(setMinimizeWhilePlaying)
        getSettingBoolean("close-on-game-exit").then(setCloseOnGameExit)

        getSettingBoolean("show-snapshots").then(setShowSnapshots)
        getSettingBoolean("show-beta-and-alpha").then(setShowBetaAndAlpha)
        getSetting("launch-args").then(setLaunchArgs)
        getSettingBoolean("loggingActive").then(setDebugLogging)

        setReady(true)
        return () => setReady(false)
    }, [])


    useEffect(() => {
        function checkAndSetSetting(setting: string, value: any){
            if(!value) return
            setSetting(setting, value)
        }

        if(!ready) return

        checkAndSetSetting("ram", ramSelected)
        checkAndSetSetting("mcPath", mcPath)
        checkAndSetSetting("javaPath", javaPath)
        setSetting("splash-width", width)
        setSetting("splash-height", height)
        setSetting("minimize-while-playing", minimizeWhilePlaying)
        setSetting("close-on-game-exit", closeOnGameExit)
        setSetting("show-snapshots", showSnapshots)
        setSetting("show-beta-and-alpha", showBetaAndAlpha)
        setSetting("launch-args", launchArgs)
        setSetting("loggingActive", debugLogging)
    }, [
        ramSelected,
        mcPath,
        javaPath,
        width,
        height,
        minimizeWhilePlaying,
        closeOnGameExit,
        showSnapshots,
        showBetaAndAlpha,
        launchArgs,
        debugLogging
    ])

    function valuetext(value: number) {
        return `${(value / 1024).toFixed(1)}GB`;
    }

    return (
        <PageBase>
            <div className="container mt-3">
                <h3>Minecraft Settings</h3><hr />

                <div style={{display: "flex"}}>
                    <label htmlFor="ram-slider" className="me-5">RAM</label>
                    <Slider
                        aria-labelledby="ram-slider"
                        value={ramSelected!}
                        defaultValue={1024}
                        getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        step={512}
                        valueLabelDisplay="auto"
                        min={1024}
                        max={ramTotal}
                        marks
                        onChange={(_, value) => {
                            setRamSelected(value as number)
                        }}
                    />
                    <div className="text-center ms-5 pt-1 px-5 bg-dark">
                        {(ramSelected! / 1024).toFixed(1)}GB
                    </div>
                </div>

                <table className="table table-borderless mt-3">
                    <tbody>
                        <tr>
                            <SettingsInput name="Minecraft Path" type="path" value={mcPath!} onChange={(v) => setMcPath(v as string)} />
                            <SettingsInput name="Java Installation" type="dropdown-file" debugMode={debugLogging} value={javaPath!} onChange={(v) => setJavaPath(v as string)} />
                        </tr>
                        <tr>
                            <SettingsInput name="SplashScreen Width" type="number" value={width} onChange={(v) => setWidth(Number(v) as number)} />
                            <SettingsInput name="SplashScreen Height" type="number" value={height} onChange={(v) => setHeight(Number(v) as number)} />
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="container mt-3">
                <h3>Launcher Settings</h3><hr />

                <SettingsCheckbox name="Minimize Launcher while Minecraft is running" value={minimizeWhilePlaying} onChange={setMinimizeWhilePlaying} />
                <SettingsCheckbox name="Close Launcher when Minecraft is closed" value={closeOnGameExit} onChange={setCloseOnGameExit} />
            </div>
            <div className="container mt-3">
                <h3>Advanced Settings</h3><hr />

                <SettingsCheckbox name="Show Vanilla Snapshots Versions" value={showSnapshots} onChange={setShowSnapshots} />
                <SettingsCheckbox name="Show Vanilla Beta and Alpha Versions" value={showBetaAndAlpha} onChange={setShowBetaAndAlpha} />

                <table className="table table-borderless mt-3 mb-3">
                    <tbody>
                        <tr>
                            <SettingsInput name="Java Launch Arguments" type="text" value={launchArgs ? launchArgs : ""} onChange={(v) => setLaunchArgs(v as string)} />
                        </tr>
                    </tbody>
                </table>

                <SettingsCheckbox name="Debug Mode" value={debugLogging} onChange={setDebugLogging} />
            </div>
        </PageBase>
    )
}

export default Settings;
