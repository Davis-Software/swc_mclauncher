import ReactDOM from "react-dom";
import React from "react";
import {exposedFunctions} from "../utils/constants";
import {Button} from "@mui/material";
import GamesInfoType from "../types/gameInfoType";

function GameInfo() {
    const [activeClients, setActiveClients] = React.useState<GamesInfoType>({});
    const [activeClientsCount, setActiveClientsCount] = React.useState<number>(0);

    React.useEffect(() => {
        exposedFunctions("mc").sendRunningClients()
        exposedFunctions("mc").on("runningClients", setActiveClients)

        return () => {
            exposedFunctions("mc").off("runningClients", setActiveClients)
        }
    }, [])
    React.useEffect(() => {
        setActiveClientsCount(Object.keys(activeClients).length)
    }, [activeClients])

    function ListItem({clientUUID}: {clientUUID: string }) {
        const client = activeClients[clientUUID]

        return (
            <li className="d-flex p-2">
                <div className="flex-grow-1">
                    <div>
                        <span>{client.name || "Vanilla"}</span> <br/>
                        <span>{client.version.number} ({client.version.type})</span>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <Button
                        disabled={client.pid === null}
                        color="error"
                        onClick={() => {
                            exposedFunctions("mc").killClient(clientUUID)
                        }}
                    >
                        Kill
                    </Button>
                </div>
            </li>
        )
    }
    function ListDivider(){
        return <li><hr className="dropdown-divider"></hr></li>
    }

    function GameInfoInner(){
        return activeClientsCount ? (
            <div className="dropdown">
                <Button
                    className="button dropdown-toggle attach-candle"
                    id="dropdownMenuButton2"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    color="success"
                >{activeClientsCount > 1 ? `${activeClientsCount} Games running` : "Game running"}</Button>
                <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton2"
                    style={{width: "300px"}}
                >
                    {Object.keys(activeClients).map((clientUUID, index) =>
                        <ListItem clientUUID={clientUUID} key={index} />
                    )}
                    <ListDivider />
                    <li>
                        <a
                            className="dropdown-item attach-candle text-danger"
                            onClick={() => {
                                exposedFunctions("mc").killClient("all")
                            }}
                        >
                            Kill all
                        </a>
                    </li>
                </ul>
            </div>
        ) : <></>
    }

    return ReactDOM.createPortal(<GameInfoInner />, document.getElementById("game-info")!)
}

export default GameInfo
