const os = require("os");
const {registerIpcListener} = require("./ipc-handler");
const {platform} = require("./config");
const childProcess = require("child_process");


registerIpcListener("get-ram-amount", () => {
    return Math.round(os.totalmem() / 1024 / 1024);
})


function findJavaPaths() {
    try{
        let paths

        if(platform === "win32"){
            paths = childProcess.execSync("where java.exe").toString().trim().split("\r\n")
        }else{
            paths = childProcess.execSync("which java").toString().trim().split("\n")
        }

        paths = paths.map(path => ({
            path,
            version: childProcess.execSync(`"${path}" -version 2>&1`).toString().trim().split('"')[1]
        }))

        return paths
    } catch(e){
        return []
    }
}


module.exports = {
    findJavaPaths
}
