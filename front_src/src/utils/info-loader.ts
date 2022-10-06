import {McVersionResponseType} from "../types/mcVersionType";

let mcVersions: McVersionResponseType


function loadMCVersions(): Promise<McVersionResponseType> {
    return new Promise((resolve) => {
        if(mcVersions){
            resolve(mcVersions)
        }else{
            console.log("loading mc versions")
            fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')
                .then(response => response.json())
                .then(data => {
                    mcVersions = data
                    resolve(mcVersions)
                })
        }
    })
}

export {loadMCVersions}
