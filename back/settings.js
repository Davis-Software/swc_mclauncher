const fs = require("fs")
const path = require("path")
const {appDataDir} = require("./config")
const {findJavaPaths} = require("./utils");
const {errorWindow} = require("./electron-tools");

const javaPaths = findJavaPaths()
if(javaPaths.length < 1){
    errorWindow(
        "Java not found",
        "No Java installation was found on your system.\n" +
        "Please install at least one Java version and try again.\n\n" +
        "If you have already installed Java, please make sure that it is in your PATH environment variable.\n\n" +
        "Java can be downloaded from https://java.com/download"
    )
    process.exit(1)
}

class Settings {
    constructor(){
        this.settings = {
            credentials: null,
            ram: 1024,
            mcPath: path.join(appDataDir, "..", ".minecraft_swc"),
            javaPath: javaPaths[0].path,
            "splash-width": "1280",
            "splash-height": "720",
            "launch-args": ""
        }
        this.load()
        this.set("javaPaths", javaPaths)
    }
    load(){
        if(!fs.existsSync(appDataDir)){
            fs.mkdirSync(appDataDir, {recursive: true})
        }
        if(!fs.existsSync(path.join(appDataDir, "settings.json"))){
            this.save()
        }
        try{
            this.settings = JSON.parse(fs.readFileSync(path.join(appDataDir, "settings.json"), "utf8"))
        }catch(e){
            console.error("Error loading settings", e)
            console.info("Using temporary settings storage")
            this.settings = {}
        }
    }
    save(){
        fs.writeFileSync(path.join(appDataDir, "settings.json"), JSON.stringify(this.settings, null, 4))
    }
    get(key){
        return this.settings[key] || null
    }
    set(key, value){
        this.settings[key] = value
        this.save()
    }
}

let settings = new Settings()
settings.load()

module.exports = settings
