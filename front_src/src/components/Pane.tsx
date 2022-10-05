import React from "react";

interface PaneProps {
    children: React.ReactNode | React.ReactNode[]
    dark?: boolean
    head?: React.ReactNode
    [key: string]: any
}
function Pane({children, dark, head, ...props}: PaneProps){
    return (
        <div className={"pane" + (dark ? " dark" : "")} {...props}>
            {head && <div className="pane-head">{head}</div>}
            {children}
        </div>
    )
}

export default Pane;
