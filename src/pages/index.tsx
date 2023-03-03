import type { HeadFC, PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Main>
            <H1>mrmr</H1>
            <Poem />
            <Items />
        </Main>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home</title>;

const items = [
    {
        text: "come dream with me",
        url: "/come",
        color: "#3C1DFE",
    },
];

const Main = styled.main`
    margin: auto;
`;

const H1 = styled.h1`
    font-size: 4rem;
    font-family: system-ui, sans-serif;
    text-align: center;
    margin-top: 40svh;
    color: hsl(0, 0%, 13.3%);
`;

const Items: React.FC = () => {
    return (
        <ul style={{ color: "white" }}>
            {items.map(({ url, text }) => (
                <li key={url}>{text}</li>
            ))}
        </ul>
    );
};

const Poem: React.FC = () => {
    return (
        <PoemC>
            <PoemText />
        </PoemC>
    );
};

const PoemC = styled.p`
    margin: 40svh 2rem;
    font-family: serif;
    display: flex;
`;

const PoemText: React.FC = () => {
    return (
        <p>
            <i>murmur</i> to me softly
            <br />
            &nbsp;&nbsp;tell me it is <i>all right</i>
            <br />
            in the <i>wind</i> rustle leaves
            <br />
            &nbsp;&nbsp;the moon, and the <i>night</i>
        </p>
    );
};
