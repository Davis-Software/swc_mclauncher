import React, {useEffect} from "react";
import PageBase from "../PageBase";
import {exposedFunctions} from "../../utils/constants";

function About(){
    const aboutRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        exposedFunctions("utils").renderMarkdownFile("README.md").then((html: string) => {
            aboutRef.current!.innerHTML = html;
        })
    }, [])

    return (
        <PageBase>
            <div ref={aboutRef} className="container mt-3"></div>
        </PageBase>
    )
}

export default About
