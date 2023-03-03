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

    /* Give more breathing space to the lines.
     *
     * The default is apparently browser / font dependent, with MDN mentioning
     * that Firefox uses 1.2 usually. However, on Safari macOS, the default with
     * system-ui seemed to be lesser than 1.2 even and quite scrunchy.
     */
    /* line-height: 1.3; */

    /* Set pleasant, readable, mode specific colors */
    background-color: white;
    color: hsl(0, 0%, 33.3%);
    @media (prefers-color-scheme: dark) {
        background-color: hsl(0, 0%, 26.6%);
        color: hsl(0, 0%, 93.3%);
    }

    /* Styling links
     *
     * Anchor tags with an attached href do not inherit color.
     *
     * An anchor can be in the different states, which can be targeted
     * using the following pseudo classes:
     * - a:link    / an anchor tag with a destination
     * - a:visited / exists in the browser history
     * - a:hover
     * - a:focused / using a keyboard, e.g. option + tab on macOS
                     by default, shows a blue box border around the link
     * - a:active  / when the user actually presses the link (red)
     */
    a {
        color: hsl(0, 0%, 40%);
    }

    a:hover {
        color: hsl(0, 0%, 6.6%);
    }

    a:active {
        color: hsl(0, 0%, 0%);
        background-color: hsl(0, 0%, 93.3%);
    }

    @media (prefers-color-scheme: dark) {
        a {
            color: hsl(0, 0%, 60%);
        }

        a:hover {
            color: hsl(0, 0%, 80%);
        }

        a:active {
            color: hsl(0, 0%, 100%);
            background-color: hsl(0, 0%, 33.3%);
        }
    }
`;

const Main = styled.main`
    min-height: 90svh;
    display: grid;
    place-content: center;
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

const Text = styled.p`
    line-height: 1.3;
`;

const Content: React.FC = () => {
    return (
        <div>
            <H1>404</H1>
            <Quote>
                <i>like a tear in the rain</i>
            </Quote>
            <Text>
                The page you're looking for,
                <br />
                doesn't exist anymore.
            </Text>
            <p>Or maybe it never did.</p>
            <p>
                <Link to="/">You can always start again</Link>
            </p>
        </div>
    );
};
