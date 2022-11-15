const os = require("os");
const {registerIpcListener, registerIpcListenerSync} = require("./ipc-handler");
const {platform} = require("./config");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");


registerIpcListenerSync("log", console.log)
registerIpcListener("get-ram-amount", () => {
    return Math.round(os.totalmem() / 1024 / 1024);
})


function findJavaPaths() {
    try{
        let paths

        if(process.platform === "win32"){
            paths = childProcess.execSync("where java.exe").toString().trim().split("\r\n")
        }else if(process.platform === "linux"){
            try {
                paths = childProcess.execSync("update-alternatives --list java").toString().trim().split("\n")
            }catch{
                paths = childProcess.execSync("which java").toString().trim().split("\n")
            }
        }else{
            paths = childProcess.execSync("which java").toString().trim().split("\n")
        }

        paths = paths.map(jPath => ({
            path: jPath,
            version: childProcess.execSync(`"${jPath}" -version 2>&1`).toString().trim().split('"')[1],
            jdk: fs.existsSync(path.join(path.dirname(jPath), platform !== "win32" ? "javac" : "javac.exe"))
        }))

        return paths
    } catch(e){
        return []
    }
}


module.exports = {
    findJavaPaths
}
