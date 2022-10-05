const os = require("os");
const {registerIpcListener} = require("./ipc-handler");


registerIpcListener("get-ram-amount", () => {
    return Math.round(os.totalmem() / 1024 / 1024);
})
