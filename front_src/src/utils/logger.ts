class Logger{
    private static _log(message: string, level: string){
        // @ts-ignore
        console[level](`[${level.toUpperCase()}] ${message}`)
    }
    static debug(message: string){
        Logger._log(message, 'debug')
    }
    static log(message: string){
        Logger._log(message, 'log')
    }
    static info(message: string){
        Logger._log(message, 'info')
    }
    static warn(message: string){
        Logger._log(message, 'warn')
    }
    static error(message: string){
        Logger._log(message, 'error')
    }
}

export default Logger;
