import React, {useEffect} from "react";
import PageBase from "./PageBase";
import Pane from "../components/Pane";
import {UserInterface} from "../types/userInterface";
import {getSetting} from "../utils/settings";

function Home(){
    const [userData, setUserData] = React.useState<UserInterface | null>(null)

    useEffect(() => {
        getSetting("credentials").then(setUserData)
    }, [])

    return (
        <PageBase bgImage="../static/images/home-bg.png">
            <div style={{textAlign: "center", marginTop: "10vh"}}>
                <Pane dark>
                    <div className="d-flex justify-content-center">
                        <img src="../static/logo/512x512.png" alt="logo" width="128" height="128" />
                        <h1 style={{fontSize: "4rem", fontWeight: "bold"}} className="ps-4 pt-2">Software City's</h1>
                    </div>
                    <h2 style={{fontSize: "2rem", translate: "62px -45px"}}>Modded-Minecraft Launcher</h2>

                    <div className="text-center pt-5 pb-5">
                        <h1>Welcome, {userData?.name}!</h1>
                    </div>
                </Pane>
            </div>
        </PageBase>
    )
}

export default Home;
