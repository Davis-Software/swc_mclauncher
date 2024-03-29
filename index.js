const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron")
const path = require("path");

const config = require("./back/config")
const settings = require("./back/settings")
const {invoke, registerIpcListener, registerIpcListenerSync} = require("./back/ipc-handler");

require("./back/mc-connector")
require("./back/utils")
const {autoUpdater} = require("electron-updater");


let win
let checkedForUpdates = false


function MainWindow () {
    let winSize = settings.get("window-size")
    let fullscreen = settings.get("window-maximized")

    win = new BrowserWindow({
        minWidth: 1280,
        minHeight: 720 + 20,  // menu bar adds 20px
        width: winSize && !fullscreen ? winSize[0] : 1280,
        height: winSize && !fullscreen ? (winSize[1] + 20) : 720,
        resizable: true,
        darkTheme: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false
        }
    })
    if(fullscreen) win.maximize()

    win.identifier = "main-window"
    require("./back/update-service")

    win.forceClose = () => {
        win.allowClose = true
        win.close()
    }

    ipcMain.handle("window:minimize", _ => {
        win.minimize()
    })
    ipcMain.handle("window:toggleSize", _ => {
        if(win.isMaximized()){
            win.unmaximize()
        }else{
            win.maximize()
        }
    })
    ipcMain.handle("window:close", _ => {
        win.forceClose()
        BrowserWindow.getAllWindows().forEach(window => {
            if(!window.closable) return
            window.close()
        })
        app.quit()
    })
    ipcMain.handle("window:setProgressBar", (_, value) => {
        win.setProgressBar(value)
    })
    ipcMain.handle("window:flashFrame", (_, value) => {
        win.flashFrame(value)
    })
    ipcMain.handle("window:isMaximized", () => {
        return win.isMaximized()
    })
    function resizeEvent(){
        invoke("window:reSize")
    }
    win.on("maximize", resizeEvent)
    win.on("unmaximize", resizeEvent)

    ipcMain.handle("check-for-updates", () => {
        if(!config.devMode && config.autoUpdate && !checkedForUpdates) {
            autoUpdater.checkForUpdates().then(() => {
                checkedForUpdates = true
            })
        }
    })
    ipcMain.handle("dialog:showDialog", (event, options) => {
        return new Promise((resolve) => {
            dialog.showOpenDialog(win, options).then((canceled, result) => {
                resolve(canceled, result)
            })
        })
    })
    ipcMain.handle("open-in-explorer", (event, modpackId) => {
        shell.openPath(path.join(settings.get("mcPath"), "mod-packs", modpackId))
    })

    win.webContents.on("devtools-opened", () => {
        invoke("window:devTools")
    })
    win.on('focus', () => {
        win.flashFrame(false)
        BrowserWindow.getAllWindows().forEach(w => {
            if(!w.hasOwnProperty("identifier")) return
            if(["progress-bar"].includes(w.identifier)){
                w.show()
            }
        })
    })
    win.on("close", (e) => {
        if(win.allowClose) return
        e.preventDefault()
        invoke("ops:running-operation-check")
    })
    win.setIcon(config.iconPath)

    win.loadFile(`${__dirname}/templates/index.html`).then()
    win.show()

    attachWindowQOLSaves()
}
app.whenReady().then(() => {
    if(!app.requestSingleInstanceLock()) return
    MainWindow()
})
app.on('activate', () => {
    console.log(BrowserWindow.getAllWindows())
    if (BrowserWindow.getAllWindows().length === 0) {
        MainWindow()
    }
})

// Single Instance lock
function openedByUrl(url) {
    if(url) win.webContents.send('openedByUrl', url)
}
if (app.requestSingleInstanceLock()) {
    app.on('second-instance', (e, argv) => {
        if (config.platform === 'win32') {
            openedByUrl(argv.find((arg) => arg.startsWith('swc_mclauncher:')))
        }
        if (win) {
            if (win.isMinimized()) win.restore()
            win.show()
            win.focus()
        }
    })
}

if (!app.isDefaultProtocolClient('swc_mclauncher')) {
    app.setAsDefaultProtocolClient('swc_mclauncher')
}


function attachWindowQOLSaves(){
    win.on("resize", () => {
        settings.set("window-size", win.getSize())
    })
    win.on("maximize", () => {
        settings.set("window-maximized", win.isMaximized())
    })
    win.on("unmaximize", () => {
        settings.set("window-maximized", win.isMaximized())
    })
}


registerIpcListener("settings:get", (event, key) => {
    return settings.get(key)
})
registerIpcListener("settings:set", (event, key, value) => {
    return settings.set(key, value)
})
registerIpcListenerSync("settings:getSync", (event, key) => {
    return settings.get(key)
})
registerIpcListener("settings:getBulk", (event, keys) => {
    let settingsObj = {}
    keys.forEach(key => {
        settingsObj[key] = settings.get(key)
    })
    return settingsObj
})
