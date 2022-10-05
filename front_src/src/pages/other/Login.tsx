import React, {useEffect} from "react";
import PageBase from "../PageBase";
import {exposedFunctions} from "../../utils/constants";
import {UserInterface} from "../../types/userInterface";


interface LoginProps {
    pageChange: (page: string) => void;
    userDataChange: (userData: UserInterface | null) => void;
}
function Login({pageChange, userDataChange}: LoginProps) {
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setLoading(true)
        exposedFunctions("dialog").askLogin().then((e: any) => {
            if(e){
                pageChange("overview")
                userDataChange(e)
            }
            setLoading(false)
        })
    }, [])

    return (
        <PageBase>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <div style={{textAlign: "center"}}>
                    <h1>Login</h1>
                    {!loading ? (
                        <p>Log into your Minecraft account through Microsoft <br />(If you do not see the login window, please restart the launcher) </p>
                    ) : (
                        <div className="spinner-border" />
                    )}
                </div>
            </div>
        </PageBase>
    )
}

export default Login;
