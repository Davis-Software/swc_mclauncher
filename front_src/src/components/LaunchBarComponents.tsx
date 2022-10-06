import React from "react";

interface LaunchBarContentProps {
    children: React.ReactNode | React.ReactNode[]
    [key: string]: any
}
function LaunchBarListContentLeft(props: LaunchBarContentProps){
    return (
        <div {...props}>
            <ul className="list-unstyled p-0">
                {props.children}
            </ul>
        </div>
    )
}
function LaunchBarListContentRight(props: LaunchBarContentProps){
    return (
        <div {...props} className="text-end">
            <ul className="list-unstyled p-0">
                {props.children}
            </ul>
        </div>
    )
}
function LaunchBarCustomContent(props: LaunchBarContentProps){
    return (
        <div {...props}>
            {props.children}
        </div>
    )
}

export { LaunchBarListContentLeft, LaunchBarListContentRight, LaunchBarCustomContent }
