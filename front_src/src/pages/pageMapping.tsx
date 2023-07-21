import Home from "./Home";

import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import Settings from "./Settings";
import ModPack, {ModPackLaunchBar} from "./ModPack";
import {GridView} from "@mui/icons-material";
import MinecraftVanilla, {MinecraftVanillaLaunchBar} from "./MinecraftVanilla";
import Profile from "./Profile";
import SwitchAccount from "./other/SwitchAccount";
import About from "./other/About";
import {ModPackType} from "../types/modPackType";

async function loadModPacks() {
    let packs = await (await fetch("https://projects.software-city.org/resources/minecraft/modded/modpacks/packs.json")).json()
    let packsOut: pageMappingInterface = {}
    Array.from(packs).forEach((pack: any) => {
        packsOut[pack.id] = {
            component: <ModPack key={pack.id} modPack={pack} />,
            launchBar: <ModPackLaunchBar key={pack.id + "-bar"} modPack={pack} />,
            name: pack.name,
            path: "?/mod-packs/" + pack.name,
            data: pack
        }
    })
    return packsOut
}

interface pageInterface {
    component: React.ReactNode | null
    name: string
    path: string
    launchBar?: React.ReactNode
    icon?: React.ReactNode
    reload?: boolean
    bottomNav?: boolean
    noSidebar?: boolean
    hide?: boolean
    data?: ModPackType
}
interface pageMappingInterface {
    [key: string]: pageInterface;
}
let pageMapping: pageMappingInterface = {
    "overview": {
        component: <Home />,
        name: "Dashboard",
        path: "?overview",
        icon: <HomeIcon />
    },
    "vanilla": {
        component: <MinecraftVanilla />,
        name: "Vanilla",
        path: "?vanilla",
        icon: <GridView />,
        launchBar: <MinecraftVanillaLaunchBar />
    },
    "profile": {
        component: <Profile />,
        name: "Profile",
        path: "?profile",
        hide: true
    },
    "settings": {
        component: <Settings />,
        name: "Settings",
        path: "?settings",
        hide: true
    },
    "about": {
        component: <About />,
        name: "About",
        path: "?about",
        hide: true
    },
    "switch": {
        component: <SwitchAccount />,
        name: "Switch Account",
        path: "?switch",
        hide: true
    }
}


export default pageMapping;
export { loadModPacks }
export type { pageInterface, pageMappingInterface };
