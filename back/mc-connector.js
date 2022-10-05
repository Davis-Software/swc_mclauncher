const {auth} = require('msmc')
const settings = require("./settings");
const {registerIpcListener} = require("./ipc-handler");


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

registerIpcListener("dialog:askLogin", askLogin)
registerIpcListener("dialog:logout", logout)

module.exports = {
    askLogin,
    logout
}
