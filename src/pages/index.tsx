import type { HeadFC, PageProps } from "gatsby";
import * as React from "react";

const items = [
    {
        text: "come dream with me",
        url: "/come",
        color: "#3C1DFE",
    },
];

const IndexPage: React.FC<PageProps> = () => {
    return (
        <main>
            <h1>murmur</h1>
            <ul>
                {items.map(({ url, text }) => (
                    <li key={url}>{text}</li>
                ))}
            </ul>
        </main>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home</title>;
