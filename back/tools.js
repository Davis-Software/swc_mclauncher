const fs = require("fs")
const path = require("path")
const {registerIpcListener} = require("./ipc-handler");
const MarkdownIt = require("markdown-it");
const config = require("./config");

class EventEmitter {
    constructor(){
        this.listeners = {}
    }
    on(event, listener){
        this.listeners[event] = this.listeners[event] || []
        this.listeners[event].push(listener)
    }
    once(event, listener){
        this.on(event, (...args) => {
            listener(...args)
            this.off(event, listener)
        })
    }
    off(event, listener){
        if(this.listeners[event]){
            this.listeners[event] = this.listeners[event].filter(l => l !== listener)
        }
    }
    emit(event, ...args){
        if(this.listeners[event]){
            this.listeners[event].forEach(listener => listener(...args))
        }
    }
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function onObjectChange(object, onChange) {
    const handler = {
        get(target, property, receiver) {
            try {
                return new Proxy(target[property], handler)
            } catch (err) {
                return Reflect.get(target, property, receiver)
            }
        },
        defineProperty(target, property, descriptor) {
            onChange(target, property, descriptor)
            return Reflect.defineProperty(target, property, descriptor)
        },
        deleteProperty(target, property) {
            onChange()
            return Reflect.deleteProperty(target, property)
        }
    }
    return new Proxy(object, handler)
}

function tryOrElse(fn, elseFn) {
    try {
        return fn()
    } catch (err) {
        elseFn()
        return null
    }
}

function walkDir(dir, excluded, filterFunc, progressCallback, errorCallback) {
    let out = []
    let files = tryOrElse(() => fs.readdirSync(dir), () => {
        errorCallback(`Could not read directory ${dir}`)
    })

    if(!files) return out
    for(let file of files){
        let filePath = path.join(dir, file)
        if(excluded && excluded.map(ex => filePath.startsWith(ex)).includes(true)) continue

        let stats = tryOrElse(() => fs.statSync(filePath), () => {
            errorCallback(`Could not read file ${filePath}`)
        })
        if(!stats) continue

        if(progressCallback) progressCallback(filePath, stats.isDirectory())

        if(stats.isDirectory()){
            Array.from(walkDir(filePath, excluded, filterFunc, progressCallback, errorCallback)).forEach(f => out.push(f))
        }else{
            if(filterFunc && !filterFunc(file)) continue
            out.push(filePath)
        }
    }
    return out
}

function sleep(x) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, x)
}

const builtMarkdown = {}
registerIpcListener("render-markdown-file", (e, file) => {
    if(builtMarkdown[file] && !config.devMode){
        return builtMarkdown[file]
    }

    try {
        let data = fs.readFileSync(
            path.join(__dirname, "../templates/components", file),
            "utf8"
        )
        let md = MarkdownIt({html: true, linkify: true}).render(data)
        builtMarkdown[file] = md
        return md
    } catch (err) {
        return false
    }
})

registerIpcListener("open-explorer", (e, file) => {
    if(fs.lstatSync(file).isDirectory()){
        return require("electron").shell.openPath(file)
    }else{
        require("electron").shell.showItemInFolder(file)
        return true
    }
})

module.exports = {EventEmitter, isObject, onObjectChange, walkDir, sleep}
