import type { HeadFC, PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";

const items = [
    {
        text: "come dream with me",
        url: "/come",
        color: "#3C1DFE",
    },
];

const H1 = styled.h1`
    font-size: 4rem;
    font-family: system-ui, sans-serif;
    text-align: center;
    margin-top: 40svh;
    color: hsl(0, 0%, 13.3%);
`;

const L = styled.span`
    color: hsl(0, 0%, 53.3%);
`;

const Main = styled.main`
    margin: auto;
`;

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Main>
            <H1>
                m<L>u</L>rm<L>u</L>r<L></L>
            </H1>
            <ul style={{ color: "white" }}>
                {items.map(({ url, text }) => (
                    <li key={url}>{text}</li>
                ))}
            </ul>
        </Main>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home</title>;
