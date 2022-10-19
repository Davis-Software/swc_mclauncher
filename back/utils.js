const os = require("os");
const {registerIpcListener} = require("./ipc-handler");
const {platform} = require("./config");
const child_process = require("child_process");


registerIpcListener("get-ram-amount", () => {
    return Math.round(os.totalmem() / 1024 / 1024);
})


function findJava() {
    try{
        if(platform === "win32"){
            return  child_process.execSync("where java.exe").toString().split("\r\n")[0]
        }else{
            return child_process.execSync("which java").toString().split("\n")[0]
        }
    } catch(e){
        return null
    }
}


module.exports = {
    findJava
}
