import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { HeadFC, Link, PageProps } from "gatsby";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";

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
        <DefaultHead title="Page not found">
            <PageColorStyle {...colorPalettes} />
        </DefaultHead>
    );
};

const colorPalettes = {
    colors: ensure(
        parseColorPalette(["hsl(0, 0%, 100%)", "hsl(0, 0%, 33.3%)"])
    ),
    darkColors: parseColorPalette(["hsl(0, 0%, 26.6%)", "hsl(0, 0%, 93.3%)"]),
};

const Main = styled.main`
    min-height: 90svh;
    display: grid;
    place-content: center;

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;

        color: hsl(0, 0%, 40%);
    }

    a:hover {
        color: hsl(0, 0%, 6.6%);
        background-color: hsl(0, 0%, 93.3%);
    }

    @media (prefers-color-scheme: dark) {
        a {
            color: hsl(0, 0%, 60%);
        }

        a:hover {
            color: hsl(0, 0%, 6.6%);
            background-color: hsl(0, 0%, 80%);
        }
    }

    a:active {
        background-color: yellow;
    }
`;

const H1 = styled.h1`
    margin-block-end: 0;
`;

const Quote = styled.p`
    margin-block: 0.7rem;
    font-family: serif;
    font-size: 1.5rem;
    color: hsl(0, 0%, 54%);
`;

const Text = styled.p`
    /* Give more breathing space to the lines.
     *
     * The default is browser / font dependent, with MDN mentioning that Firefox
     * uses 1.2 usually. Safari on macOS with system-ui felt lesser than 1.2.
     */
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
                <Link to="/">
                    You can always start again
                    <br />
                    <i>like a tear in the rain</i>
                </Link>
            </p>
        </div>
    );
};
