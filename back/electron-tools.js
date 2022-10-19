const { BrowserWindow, dialog } = require("electron")


function getMainWindow(){
    let windows = BrowserWindow.getAllWindows()
    for(let win of windows){
        if(win.hasOwnProperty("identifier") && win.identifier === "main-window"){
            return win
        }
    }
    return null
}


function errorWindow(title, message){
    dialog.showErrorBox(title, message)
}


module.exports = {
    getMainWindow,
    errorWindow
}
