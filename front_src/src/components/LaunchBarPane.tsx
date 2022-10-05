import React from "react";

interface LaunchPaneProps {
    children: React.ReactNode | React.ReactNode[]
    [key: string]: any
}
function LaunchBarPane(props: LaunchPaneProps){
    return (
        <div className="launch-pane" style={{
            marginLeft: "300px",
            display: "flex",
            justifyContent: "space-evenly",
            height: "100px",
        }} {...props}>
            {props.children}
        </div>
    )
}

export default LaunchBarPane
