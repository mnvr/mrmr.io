import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";
import { paperTheme } from "themes/themes";

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
        <DefaultHead titlePrefix="Page not found">
            <PageColorStyle {...paperTheme} />
        </DefaultHead>
    );
};

const Main = styled.main`
    min-height: 90svh;
    display: grid;
    place-content: center;

    p {
        /* Give more breathing space to the lines.
         *
         * The default is browser / font dependent, with MDN mentioning that Firefox
         * uses 1.2 usually. Safari on macOS with system-ui seems more like 1.0 rem.
         */
        line-height: 1.3;
    }

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

const SubText = styled.p`
    font-size: smaller;
    color: var(--mrmr-secondary);
`;

const Content: React.FC = () => {
    return (
        <div>
            <H1>404</H1>
            <p>
                The page you're looking for,
                <br />
                doesn't exist anymore.
                <br />
                Or maybe it never did.
            </p>

            <SubText>
                If you think this page should've been here
                <br />
                and there is some issue,
                <br />
                <a href="https://github.com/mnvr/mrmr.io/issues">
                    please let me know!
                    <BsArrowRightShort />
                </a>
            </SubText>

            <SubText style={{ marginBlockStart: "2rem" }}>
                <Link to="/">Home</Link>
            </SubText>
        </div>
    );
};
