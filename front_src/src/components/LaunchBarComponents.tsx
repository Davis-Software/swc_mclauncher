import React from "react";

interface LaunchBarContentProps {
    children: React.ReactNode | React.ReactNode[]
    right?: boolean
    childProps?: React.HTMLAttributes<HTMLDivElement>
}
function LaunchBarListContent(props: LaunchBarContentProps){
    return (
        <div {...props.childProps}>
            <ul className={"list-unstyled p-0"} style={props.right ? {textAlign: "right"} : {}}>
                {props.children}
            </ul>
        </div>
    )
}
function LaunchBarCustomContent(props: LaunchBarContentProps){
    return (
        <div {...props.childProps}>
            {props.children}
        </div>
    )
}

export { LaunchBarListContent, LaunchBarCustomContent }
