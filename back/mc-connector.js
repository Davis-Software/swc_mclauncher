const {auth} = require('msmc')
const settings = require("./settings");
const {registerIpcListener, invoke} = require("./ipc-handler");
const {Client} = require('minecraft-launcher-core')


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
    const opts = {
        authorization: settings.get("credentials"),
        root: settings.get("mcPath"),
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
        invoke("mc:gameLaunchError", e)
    })

    launcher.on('arguments', (e) => invoke("mc:arguments", e))
    launcher.on('data', (e) => invoke("mc:data", e))
    launcher.on('close', (e) => invoke("mc:close", e))
    launcher.on('package-extract', (e) => invoke("mc:package-extract", e))
    launcher.on('download', (e) => invoke("mc:download", e))
    launcher.on('download-status', (e) => invoke("mc:download-status", e))
    launcher.on('debug', (e) => invoke("mc:debug", e))
    launcher.on('progress', (e) => invoke("mc:progress", e))
}

registerIpcListener("dialog:askLogin", askLogin)
registerIpcListener("dialog:logout", logout)
registerIpcListener("mc:launchVanilla", (e, v) => launchVanilla(v))

module.exports = {
    askLogin
}
