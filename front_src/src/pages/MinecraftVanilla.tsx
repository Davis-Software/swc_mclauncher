import React from "react"
import PageBase from "./PageBase";
import Pane from "../components/Pane";
import {LaunchBarButton, LaunchBarContentLeft, LaunchBarContentRight} from "../components/LaunchBarComponents";

function MinecraftVanillaLaunchBar(){
    return (
        <>
            <LaunchBarContentLeft />
            <LaunchBarButton />
            <LaunchBarContentRight />
        </>
    )
}

function MinecraftVanilla(){
    return (
        <PageBase bgImage="../static/images/vanilla-bg.png">
            <div style={{textAlign: "center", marginTop: "10vh"}}>
                <Pane dark>
                    <div className="title jumbotron mb-5">
                        <img className="w-75" src="./../static/images/mc.png" alt="" />
                        <h3 style={{fontFamily: "MinecraftEvenings"}}>JAVA Edition</h3>
                        <span className="float-end">by Mojang</span>
                    </div>
                </Pane>
            </div>
        </PageBase>
    )
}

export default MinecraftVanilla
export { MinecraftVanillaLaunchBar }
