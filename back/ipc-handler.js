const { ipcMain, webContents } = require("electron")

function registerIpcListener(channel, callback, once=false){
    ipcMain.handle(channel, (...resp) => {
        if(once){
            ipcMain.removeHandler(channel)
        }
        return callback(...resp)
    })
}
function registerIpcListenerSync(channel, callback, once=false){
    ipcMain.on(channel, function(event, ...resp){
        if(once){
            ipcMain.removeListener(channel, this)
        }
        event.returnValue = callback(event, ...resp)
    })
}

function invoke(channel, ...args){
    webContents.getAllWebContents().forEach(webContent => {
        webContent.send(channel, ...args)
    })
}


module.exports = {
    registerIpcListener,
    registerIpcListenerSync,
    invoke
}
