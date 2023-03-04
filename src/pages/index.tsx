import CustomHead from "components/CustomHead";
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

export const Head: HeadFC = () => {
    return (
        <CustomHead>
            <Body />
        </CustomHead>
    );
};

const items = [
    {
        text: "come dream with me",
        url: "/come",
        color: "#3C1DFE",
    },
];

const Body = styled.body`
    margin: 0;

    background-color: hsl(0, 0%, 100%);
    color: hsl(0, 0%, 13%);
    --title-color: hsl(0, 0%, 18%);
    @media (prefers-color-scheme: dark) {
        background-color: hsl(240, 6%, 20%);
        color: hsl(240, 12%, 90%);
        --title-color: hsla(240, 12%, 85%);
    }
`;

const Main = styled.main`
    margin: 0;
`;

const H1 = styled.h1`
    margin-top: 0;
    padding-top: 40svh;
    font-size: 4rem;
    font-family: system-ui, sans-serif;
    text-align: centter;
    margin-left: 1.8rem;
    margin-bottom: 0;
    color: var(--title-color);
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

const PoemC = styled.div`
    margin: 0svh 2rem;
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
