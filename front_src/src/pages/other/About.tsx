import React from "react";
import PageBase from "../PageBase";
import MarkdownRenderer from "../../components/MarkdownRenderer";

function About(){
    return (
        <PageBase>
            <div className="m-3">
                <MarkdownRenderer url="https://raw.githubusercontent.com/Davis-Software/swc_mclauncher/master/README.md" />
            </div>
        </PageBase>
    )
}

export default About
