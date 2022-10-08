const { contextBridge, ipcRenderer } = require("electron")


contextBridge.exposeInMainWorld("utils", {
    hashing: {
        sha512: (string) => crypto.createHash("sha512").update(string).digest("hex")
    },
    getRAMAmount: () => ipcRenderer.invoke("get-ram-amount"),
})
contextBridge.exposeInMainWorld("ipc", {
    on: (channel, listener) => {
        ipcRenderer.on(channel, listener)
    }
})
contextBridge.exposeInMainWorld("controls", {
    minimize: () => {
        return ipcRenderer.invoke("window:minimize")
    },
    toggleSize: () => {
        return ipcRenderer.invoke("window:toggleSize")
    },
    close: () => {
        return ipcRenderer.invoke("window:close")
    },
    setProgressBar: value => {
        return ipcRenderer.invoke("window:setProgressBar", value)
    },
    flashFrame: value => {
        return ipcRenderer.invoke("window:flashFrame", value)
    },
    onResize: (callback) => {
        return ipcRenderer.on("window:reSize", callback)
    },
    isMaximized: () => {
        return ipcRenderer.invoke("window:isMaximized")
    }
})
contextBridge.exposeInMainWorld("dialog", {
    showDialog: (options) => {
        return ipcRenderer.invoke("dialog:showDialog", options)
    },
    askLogin: () => {
        return ipcRenderer.invoke("dialog:askLogin")
    }
})
contextBridge.exposeInMainWorld("mc", {
    launchVanilla: (version) => {
        return ipcRenderer.invoke("mc:launchVanilla", version)
    },
    on(event, callback){
        ipcRenderer.on(`mc:${event}`, (e, ...args) => callback(...args))
    }
})
contextBridge.exposeInMainWorld("settings", {
    get: async (key) => {
        return await ipcRenderer.invoke("settings:get", key)
    },
    set: (key, value) => {
        ipcRenderer.invoke("settings:set", key, value)
    },
    getSync: (key) => {
        return ipcRenderer.sendSync("settings:getSync", key)
    },
    getBulk: async (keys) => {
        return await ipcRenderer.invoke("settings:getBulk", keys)
    }
})
