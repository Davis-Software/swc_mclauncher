const {auth} = require('msmc')
const settings = require("./settings");
const {registerIpcListener, invoke} = require("./ipc-handler");
const {Client} = require('minecraft-launcher-core')
const path = require("path");
const fs = require("fs");
const {compare} = require("compare-versions");
const fsx = require("fs-extra");
const {getMainWindow, errorWindow} = require("./electron-tools");
const {randomUUID} = require("crypto")
const ObservableSlim = require("observable-slim")


const runningClients = ObservableSlim.create({}, false, sendRunningClients)
let mcInstance = null


function sendRunningClients(){
    let clients = {}
    for(let key in runningClients){
        let client = runningClients[key]
        clients[key] = {version: client.version, pid: client.pid, name: client.name}
    }
    invoke("mc:runningClients", JSON.parse(JSON.stringify(clients)))
}


function ensureFolder(){
    fs.mkdirSync(settings.get("mcPath"), {recursive: true})
}
function afterLaunchCalls(){
    if(settings.get("minimize-while-playing")){
        getMainWindow().hide()
    }
}
function afterCloseCalls(){
    if(settings.get("close-on-game-exit")){
        getMainWindow().forceClose()
    } else if(settings.get("minimize-while-playing")){
        getMainWindow().show()
    }
}


function askLogin() {
    const msMc = new auth('select_account')

    return new Promise((resolve) => {
        msMc.launch('electron').then(async e => {
            const mc = await e.getMinecraft()
            let credentials = mc.mclc()

            settings.set("credentials", credentials)
            settings.set("refresh-token", e.msToken)

            mcInstance = e
            resolve(credentials)
        }).catch(() => {
            mcInstance = null
            resolve(null)
        })
    })
}
function askValidate(){
    if(!mcInstance) return false

    return mcInstance.validate()
}
function refreshLogin(forceReLogin = false){
    if(!settings.get("refresh-token")) return null

    const msMc = new auth("none")
    return new Promise((resolve) => {
        msMc.refresh(settings.get("refresh-token")).then(async e => {
            const mc = await e.getMinecraft()
            let credentials = mc.mclc()

            if(credentials.access_token !== settings.get("credentials").access_token){
                settings.set("credentials", credentials)
                settings.set("refresh-token", e.msToken)
            }

            mcInstance = e
            resolve(credentials)
        }).catch(() => {
            mcInstance = null
            if(forceReLogin){
                askLogin().then(resolve)
            }else{
                resolve(null)
            }
        })
    })
}
function logout(){
    settings.set("credentials", null)
}

function launchVanilla(version) {
    invoke("mc:initGame")
    ensureFolder()

    if(!askValidate()){
        refreshLogin(true).then(() => launchVanilla(version))
        invoke("mc:close", 0)
        return
    }

    const launcher = new Client()
    const launcherUUID = randomUUID()
    runningClients[launcherUUID] = {version, launcher, pid: null, kill: null}

    const opts = {
        authorization: settings.get("credentials"),
        root: path.join(settings.get("mcPath"), "vanilla"),
        version: version,
        customArgs: settings.get("launch-args"),
        memory: {
            max: settings.get("ram"),
            min: settings.get("ram") / 2
        },
        javaPath: settings.get("javaPath"),
        window: {
            width: settings.get("splash-width"),
            height: settings.get("splash-height")
        },
        overrides:{
            detached: false
        }
    }

    launcher.launch(opts).then((childProcess) => {
        invoke("mc:gameLaunched")

        if(!childProcess){
            invoke("mc:data", "Spawning child process failed because of an unknown error")
            throw new Error("Client crashed before launch")
        }

        runningClients[launcherUUID].pid = childProcess.pid | null
        runningClients[launcherUUID].kill = () => {
            invoke("mc:data", "Killing child process...")
            childProcess.kill()
        }
        afterLaunchCalls()
    }).catch((e) => {
        delete runningClients[launcherUUID]
        invoke("mc:gameLaunchError", e.message)
    })

    launcher.on('arguments', (e) => invoke("mc:arguments", e))
    launcher.on('data', (e) => invoke("mc:data", e))
    launcher.on('close', (e) => {
        delete runningClients[launcherUUID]
        invoke("mc:close", e)
        afterCloseCalls()
    })
    launcher.on('download', (e) => invoke("mc:download", e))
    launcher.on('download-status', (e) => invoke("mc:download-status", e))
    launcher.on('debug', (e) => invoke("mc:debug", e))
    launcher.on('progress', (e) => invoke("mc:progress", e))
}

function launchModded(manifest) {
    invoke("mc:initGame")
    ensureFolder()

    if(!askValidate()){
        refreshLogin(true).then(() => launchModded(manifest))
        invoke("mc:close", 0)
        return
    }

    const rootPath = path.join(settings.get("mcPath"), "mod-packs", manifest.id)

    let currentManifest
    let installNeeded = false
    let mcPackage = `https://projects.software-city.org/resources/minecraft/modded/modpacks/${manifest.id}.zip`

    if(!fs.existsSync(rootPath)){
        fs.mkdirSync(rootPath, {recursive: true})
        installNeeded = true
    }
    if(!fs.existsSync(path.join(rootPath, "manifest.json"))) {
        currentManifest = manifest
        installNeeded = true
    } else {
        currentManifest = JSON.parse(fs.readFileSync(path.join(rootPath, "manifest.json")).toString())
    }
    if(compare(manifest.version, currentManifest.version, ">")){
        installNeeded = true
    }

    if(installNeeded){
        let del = [
            "bin",
            "config",
            "mods"
        ]

        invoke("mc:packageMode")
        fs.readdirSync(rootPath).filter(n => del.includes(n)).forEach(file => {
            fsx.removeSync(path.join(rootPath, file))
        })
        invoke("mc:packageInstall")
    }

    const launcher = new Client()
    const version = {
        number: manifest.mcVersion,
        type: manifest.type
    }
    const launcherUUID = randomUUID()
    runningClients[launcherUUID] = {
        version,
        name: manifest.name,
        launcher,
        pid: null,
        kill: null
    }

    const opts = {
        clientPackage: installNeeded ? mcPackage : null,
        forge: manifest.binary ?
            path.join(rootPath, ...manifest.binary.split("/")) :
            path.join(rootPath, "bin", `forge-${manifest.mcVersion}.jar`),

        authorization: settings.get("credentials"),
        root: rootPath,
        version,
        customArgs: settings.get("launch-args"),
        memory: {
            max: settings.get("ram"),
            min: settings.get("ram")
        },
        javaPath: settings.get("javaPath"),
        window: {
            width: settings.get("splash-width"),
            height: settings.get("splash-height")
        },
        overrides:{
            detached: false
        }
    }

    launcher.launch(opts).then((childProcess) => {
        if(installNeeded) fs.writeFileSync(path.join(rootPath, "manifest.json"), JSON.stringify(manifest))
        invoke("mc:gameLaunched")

        if(!childProcess){
            invoke("mc:data", "Spawning child process failed because of an unknown error")
            throw new Error("Client crashed before launch")
        }

        runningClients[launcherUUID].pid = childProcess.pid
        runningClients[launcherUUID].kill = () => {
            invoke("mc:data", "Killing child process...")
            childProcess.kill()
        }
        afterLaunchCalls()
    }).catch((e) => {
        delete runningClients[launcherUUID]
        invoke("mc:gameLaunchError", e.message)
    })

    launcher.on('arguments', (e) => invoke("mc:arguments", e))
    launcher.on('data', (e) => invoke("mc:data", e))
    launcher.on('close', (e) => {
        delete runningClients[launcherUUID]
        invoke("mc:close", e)
        afterCloseCalls()
    })
    launcher.on('package-extract', () => invoke("mc:package-extract"))
    launcher.on('download', (e) => invoke("mc:download", e))
    launcher.on('download-status', (e) => invoke("mc:download-status", e))
    launcher.on('debug', (e) => invoke("mc:debug", e))
    launcher.on('progress', (e) => invoke("mc:progress", e))
}

function killClient(clientUUID) {
    if(clientUUID === "all"){
        Object.keys(runningClients).forEach(k => {
            runningClients[k].kill()
        })
        return
    }
    if(!runningClients[clientUUID] && runningClients[clientUUID].kill !== null) return
    runningClients[clientUUID].kill()
}

function cleanLogs(modpackId) {
    const rootPath = path.join(settings.get("mcPath"), "mod-packs", modpackId)

    let del = [
        "logs"
    ]

    fs.readdirSync(rootPath).filter(n => del.includes(n)).forEach(file => {
        fsx.removeSync(path.join(rootPath, file))
    })
}

function uninstallModpack(modpackId) {
    const rootPath = path.join(settings.get("mcPath"), "mod-packs", modpackId)
    if(!fs.existsSync(rootPath)) {
        errorWindow("Modpack not found", "The modpack you are trying to uninstall does not exist")
        return
    }
    fsx.removeSync(rootPath)
}

registerIpcListener("dialog:askLogin", askLogin)
registerIpcListener("dialog:askValidate", askValidate)
registerIpcListener("dialog:refreshLogin", refreshLogin)
registerIpcListener("dialog:logout", logout)
registerIpcListener("mc:launchVanilla", (e, v) => launchVanilla(v))
registerIpcListener("mc:launchModded", (e, v) => launchModded(v))
registerIpcListener("mc:sendRunningClients", () => sendRunningClients())
registerIpcListener("mc:killClient", (e, v) => killClient(v))
registerIpcListener("mc:cleanLogs", (e, v) => cleanLogs(v))
registerIpcListener("mc:uninstallModpack", (e, v) => uninstallModpack(v))

module.exports = {
    askLogin,
    askValidate,
    refreshLogin,
    logout
}
