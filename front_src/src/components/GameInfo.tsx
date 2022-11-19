import ReactDOM from "react-dom";
import React from "react";
import {exposedFunctions} from "../utils/constants";
import {Button} from "@mui/material";

function GameInfo() {
    const [activeClients, setActiveClients] = React.useState(0);

    React.useEffect(() => {
        exposedFunctions("mc").on("runningClients", setActiveClients)

        return () => {
            exposedFunctions("mc").off("runningClients", setActiveClients)
        }
    }, [])

    function GameInfoInner(){
        return activeClients ? (
            <Button
                sx={{height: "100%"}}
                color="success"
            >{activeClients > 1 ? `${activeClients} Games running` : "Game running"}</Button>
        ) : <></>
    }

    return ReactDOM.createPortal(<GameInfoInner />, document.getElementById("game-info")!)
}

export default GameInfo
