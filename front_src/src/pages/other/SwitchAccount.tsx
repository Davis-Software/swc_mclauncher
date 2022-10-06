import React, {useEffect} from "react";
import PageBase from "../PageBase";
import {exposedFunctions} from "../../utils/constants";

function SwitchAccount(){
    const [tryAgain, setTryAgain] = React.useState(false)
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setLoading(true)
        exposedFunctions("dialog").askLogin().then((e: any) => {
            if(e){
                window.location.reload()
            }else{
                setLoading(false)
            }
        })
    }, [tryAgain])

    return (
        <PageBase>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <div style={{textAlign: "center"}}>
                    <h1>Switching Account...</h1>
                    {!loading ? (
                        <>
                            <p>There was an error while trying to switch accounts.<br />Did you abort the process?</p>
                            <button className="btn btn-primary mt-5" onClick={() => setTryAgain(!tryAgain)}>Try again</button>
                        </>
                    ) : (
                        <div className="spinner-border" />
                    )}
                </div>
            </div>
        </PageBase>
    )
}

export default SwitchAccount
