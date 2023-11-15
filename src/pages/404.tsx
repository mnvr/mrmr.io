import { DefaultHead } from "components/Head";
import { PageColorStyle, paperColorPalettes } from "components/PageColorStyle";
import { HeadFC, Link, PageProps } from "gatsby";
import * as React from "react";
import { BsArrowRightShort } from "react-icons/bs";
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
        <DefaultHead titleSuffix="Page not found">
            <PageColorStyle {...paperColorPalettes} />
        </DefaultHead>
    );
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

    a > svg {
        vertical-align: middle;
        margin-block-end: 1px;
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

const Quote = styled.span`
    font-family: serif;
`;

const Text = styled.p`
    /* Give more breathing space to the lines.
     *
     * The default is browser / font dependent, with MDN mentioning that Firefox
     * uses 1.2 usually. Safari on macOS with system-ui seems more like 1.0 rem.
     */
    line-height: 1.3;
`;

const Content: React.FC = () => {
    return (
        <div>
            <H1>404</H1>
            <Text>
                The page you're looking for,
                <br />
                doesn't exist anymore.
            </Text>
            <p>Or maybe it never did.</p>
            <p>
                <Link to="/">
                    <Quote>
                        <i>
                            You can always start again
                            <br />
                            like a tear in the rain
                        </i>
                    </Quote>
                    <BsArrowRightShort />
                </Link>
            </p>
        </div>
    );
};
