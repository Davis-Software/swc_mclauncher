import React from "react";
import {TransitionGroup} from "react-transition-group";
import {Fade} from "@mui/material";

function renderLaunchBarPane(content: LaunchPaneProps["children"]) {
    function Render(){
        return (
            <TransitionGroup component={null}>
                <Fade>
                    <div className="launch-pane-inner">
                        {content}
                    </div>
                </Fade>
            </TransitionGroup>
        )
    }

    return <Render />
}

interface LaunchPaneProps {
    children: React.ReactNode | React.ReactNode[]
    disabled?: boolean
}
function LaunchBarPane(props: LaunchPaneProps){
    return (
        <div className="launch-pane">
            {renderLaunchBarPane(props.children)}
        </div>
    )
}

export default LaunchBarPane
