import {Button} from "@mui/material";
import React from "react";

function LaunchBarButton(){
    return (
        <div style={{flexGrow: 1, display: "flex", justifyContent: "center"}}>
            <Button variant="contained" color="success" sx={{width: "20vw"}}>
                Play
            </Button>
        </div>
    )
}

function LaunchBarContentLeft(){
    return (
        <div>
            <ul className="list-unstyled p-0">
                <li>Mod pack name</li>
                <li>Mod pack description</li>
            </ul>
        </div>
    )
}

function LaunchBarContentRight(){
    return (
        <div className="text-end">
            <ul className="list-unstyled p-0">
                <li>Mod pack name</li>
                <li>Mod pack description</li>
            </ul>
        </div>
    )
}

export { LaunchBarButton, LaunchBarContentLeft, LaunchBarContentRight }
