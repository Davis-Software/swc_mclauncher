import {getSettingSync} from "./settings";

function printLog(message: string, level: string, active: boolean) {
    if(!active) return;
    // @ts-ignore
    console[level](`[${level.toUpperCase()}] ${message}`)
}

class Logger{
    _loggingActive: boolean;

    constructor() {
        this._loggingActive = (getSettingSync("loggingActive") === true);
    }
    debug(message: string){
        printLog(message, 'debug', this._loggingActive)
    }
    log(message: string){
        printLog(message, 'log', this._loggingActive)
    }
    info(message: string){
        printLog(message, 'info', this._loggingActive)
    }
    warn(message: string){
        printLog(message, 'warn', this._loggingActive)
    }
    error(message: string){
        printLog(message, 'error', this._loggingActive)
    }
}

export default Logger;
