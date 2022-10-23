import React from "react";
import {Fade} from "@mui/material";
import {TransitionGroup} from "react-transition-group";

interface PageBaseProps {
    children: React.ReactNode | React.ReactNode[] | React.ReactElement | React.ReactElement[];
    bgImage?: string;
}
function PageBase(props: PageBaseProps) {
    const bgOptions = props.bgImage ? {
        backgroundImage: `url(${props.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
    } : {}

    return (
        <>
            <TransitionGroup component={null}>
                <Fade>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            overflowY: "auto",
                            overflowX: "hidden",
                            ...bgOptions
                        }}
                    >
                        {props.children}
                    </div>
                </Fade>
            </TransitionGroup>
        </>
    )
}

export default PageBase;
