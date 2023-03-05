import { DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import type { HeadFC, PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";

const IndexPage: React.FC<PageProps> = () => {
    const colors = {
        backgroundColor: "hsl(0, 0%, 100%)",
        color: "hsl(0, 0%, 13%)",
        darkBackgroundColor: "hsl(240, 6%, 20%)",
        darkColor: "hsl(240, 12%, 90%)",
    };

    return (
        <Main>
            <DefaultGlobalStyle {...colors} />
            <div>
                <H1>mrmr</H1>
                <Poem />
            </div>
            <Items />
        </Main>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <DefaultHead />;

interface ItemType {
    text: string;
    href: string;
    color: string;
}

const items: ItemType[] = [
    {
        text: "come dream with me",
        href: "/come",
        color: "hsl(248.2, 99.1%, 55.5%)",
    },
];

const Main = styled.main`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

const H1 = styled.h1`
    margin-top: 0;
    padding-top: 40svh;
    font-size: 4rem;
    font-family: system-ui, sans-serif;
    margin-left: 1.8rem;
    margin-bottom: 0;
    filter: opacity(0.92);
`;

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

const Items: React.FC = () => {
    return (
        <ItemsUL>
            {items.map(({ href, color, text }) => (
                <ItemLI key={href} color={color}>
                    {text}
                </ItemLI>
            ))}
        </ItemsUL>
    );
};

const ItemsUL = styled.ul`
    padding: 4rem;

    list-style: none;
    font-family: system-ui, sans-serif;
    font-weight: 500;
`;

const ItemLI = styled.li`
    background-color: ${(props) => props.color};
    color: white;
    padding: 0.2rem 0.4rem;
`;
