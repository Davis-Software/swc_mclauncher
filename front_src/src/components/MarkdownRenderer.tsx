import React, {useEffect} from "react";
import ReactMarkdown from "react-markdown";
import {LightAsync as SyntaxHighlighter} from "react-syntax-highlighter";
import remarkGfm from 'remark-gfm';


interface MarkdownRendererProps {
    url: string;
}
function MarkdownRenderer(props: MarkdownRendererProps){
    const [baseURL, setBaseURL] = React.useState("");
    const [markdown, setMarkdown] = React.useState<string | null>(null)

    useEffect(() => {
        setBaseURL(props.url.split("/").slice(0, -1).join("/"));
        fetch(props.url)
            .then(res => res.text())
            .then(setMarkdown)
    }, [props.url])

    return markdown !== null ? (
        <ReactMarkdown
            className="markdown-container"
            remarkPlugins={[remarkGfm]}
            linkTarget="_blank"
            transformImageUri={uri => uri.startsWith('http') ? uri : `${baseURL}/${uri}`}
            disallowedElements={["script", "style", "iframe", "object", "embed", "applet", "frame", "frameset"]}
            components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            language={match[1]}
                            style={{} as any}
                            useInlineStyles={false}
                            showLineNumbers={true}
                            showInlineLineNumbers={true}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        >
            {markdown}
        </ReactMarkdown>
    ) : (
        <div className="w-100 d-flex justify-content-center">
            <div className="spinner-border" />
        </div>
    )
}

export default MarkdownRenderer
