const fs = require("fs")
const path = require("path")
const {appDataDir} = require("./config")

class Settings {
    constructor(){
        this.settings = {
            "credentials": null
        }
        this.load()
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
        return this.settings[key]
    }
    set(key, value){
        this.settings[key] = value
        this.save()
    }
}

let settings = new Settings()
settings.load()

module.exports = settings
