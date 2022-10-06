const {auth} = require('msmc')
const settings = require("./settings");
const {registerIpcListener} = require("./ipc-handler");
const {Client} = require('minecraft-launcher-core')
const path = require("path");


function askLogin() {
    const msmc = new auth('select_account')

    return new Promise((resolve) => {
        msmc.on('load', console.log).launch('electron').then(async e => {
            const mc = await e.getMinecraft()
            let creds = mc.mclc()

            settings.set("credentials", creds)
            resolve(creds)
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

    launcher.launch(opts).then(() => {
        console.log('launching')
    }).catch((e) => {
        console.log(e)
    })

    launcher.on('debug', (e) => console.log(e))
    launcher.on('data', (e) => console.log(e))
}

registerIpcListener("dialog:askLogin", askLogin)
registerIpcListener("dialog:logout", logout)
registerIpcListener("mc:launchVanilla", (e, v) => launchVanilla(v))

module.exports = {
    askLogin,
    logout
}
