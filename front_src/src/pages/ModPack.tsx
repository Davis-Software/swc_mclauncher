import React from "react";
import PageBase from "./PageBase";
import {ModPackType} from "../types/modPackType";

interface ModPackProps {
    modPack: ModPackType
}
function ModPack(props: ModPackProps) {
    return (
        <PageBase bgImage={props.modPack["bg-picture"]}>
            <h1>{props.modPack.name}</h1>
            <img src={props.modPack.icon} alt={props.modPack.name} />
            <p>{props.modPack.desc}</p>
        </PageBase>
    )
}

export default ModPack;
