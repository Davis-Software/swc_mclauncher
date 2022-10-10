const {auth} = require('msmc')
const settings = require("./settings");
const {registerIpcListener, invoke} = require("./ipc-handler");
const {Client} = require('minecraft-launcher-core')
const path = require("path");
const fs = require("fs");
const {compare} = require("compare-versions");
const fsx = require("fs-extra");


const runningClients = []


function askLogin() {
    const msMc = new auth('select_account')

    return new Promise((resolve) => {
        msMc.on('load', console.log).launch('electron').then(async e => {
            const mc = await e.getMinecraft()
            let credentials = mc.mclc()

            settings.set("credentials", credentials)
            resolve(credentials)
        }).catch(() => {resolve(null)})
    })
}
function logout(){
    settings.set("credentials", null)
}

function launchVanilla(version) {
    const launcher = new Client()
    runningClients.push(launcher)

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

    invoke("mc:initGame")

    launcher.launch(opts).then(() => {
        invoke("mc:gameLaunched")
    }).catch((e) => {
        runningClients.splice(runningClients.indexOf(launcher), 1)
        invoke("mc:gameLaunchError", e)
    })

    launcher.on('arguments', (e) => invoke("mc:arguments", e))
    launcher.on('data', (e) => invoke("mc:data", e))
    launcher.on('close', (e) => {
        runningClients.splice(runningClients.indexOf(launcher), 1)
        invoke("mc:close", e)
    })
    launcher.on('download', (e) => invoke("mc:download", e))
    launcher.on('download-status', (e) => invoke("mc:download-status", e))
    launcher.on('debug', (e) => invoke("mc:debug", e))
    launcher.on('progress', (e) => invoke("mc:progress", e))
}

function launchModded(manifest) {
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

    invoke("mc:initGame")

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
    runningClients.push(launcher)

    const opts = {
        clientPackage: installNeeded ? mcPackage : null,
        forge: manifest.binary ?
            path.join(rootPath, ...manifest.binary.split("/")) :
            path.join(rootPath, "bin", `forge-${manifest.mcVersion}.jar`),

        authorization: settings.get("credentials"),
        root: rootPath,
        version: {
            number: manifest.mcVersion,
            type: manifest.type
        },
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

    launcher.launch(opts).then(() => {
        if(installNeeded) fs.writeFileSync(path.join(rootPath, "manifest.json"), JSON.stringify(manifest))
        invoke("mc:gameLaunched")
    }).catch((e) => {
        runningClients.splice(runningClients.indexOf(launcher), 1)
        invoke("mc:gameLaunchError", e)
    })

    launcher.on('arguments', (e) => invoke("mc:arguments", e))
    launcher.on('data', (e) => invoke("mc:data", e))
    launcher.on('close', (e) => {
        runningClients.splice(runningClients.indexOf(launcher), 1)
        invoke("mc:close", e)
    })
    launcher.on('package-extract', () => invoke("mc:package-extract"))
    launcher.on('download', (e) => invoke("mc:download", e))
    launcher.on('download-status', (e) => invoke("mc:download-status", e))
    launcher.on('debug', (e) => invoke("mc:debug", e))
    launcher.on('progress', (e) => invoke("mc:progress", e))
}

registerIpcListener("dialog:askLogin", askLogin)
registerIpcListener("dialog:logout", logout)
registerIpcListener("mc:launchVanilla", (e, v) => launchVanilla(v))
registerIpcListener("mc:launchModded", (e, v) => launchModded(v))

module.exports = {
    askLogin
}
