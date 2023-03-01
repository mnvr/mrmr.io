import CustomHead from "components/CustomHead";
import { HeadFC, Link, PageProps } from "gatsby";
import React from "react";
import styled from "styled-components";

const NotFoundPage: React.FC<PageProps> = () => {
    return (
        <Main>
            <Content />
        </Main>
    );
};

export default NotFoundPage;

export const Head: HeadFC = () => {
    return (
        <CustomHead title="Page not found">
            <Body />
        </CustomHead>
    );
};

const Body = styled.body`
    margin: 0;
    font-family: system-ui, sans-serif;
    text-underline-position: under;

    /* Set pleasant, readable, mode specific colors */
    background-color: white;
    color: #555;
    @media (prefers-color-scheme: dark) {
        background-color: #444;
        color: #eee;

        a {
            color: #9a9a9a;
        }

        a:hover {
            color: #cdcdcd;
        }
    }
`;

const Main = styled.main`
    min-height: 90svh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const H1 = styled.h1`
    margin-bottom: 0;
`;

const Quote = styled.p`
    margin: 0.7rem 0;
    font-family: serif;
    font-size: 1.5rem;
    color: #888;
`;

const Content: React.FC = () => {
    return (
        <div>
            <H1>404</H1>
            <Quote>
                <i>like a tear in the rain</i>
            </Quote>
            <p>
                The page you're looking for,
                <br />
                doesn't exist anymore.
                <br />
                Or maybe it never did.
                <br />
            </p>
            <p>
                <Link to="/">You can always start again</Link>
            </p>
        </div>
    );
};
