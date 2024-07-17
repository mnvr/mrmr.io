import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { paperTheme } from "themes/themes";

const Page: React.FC<PageProps> = () => {
    return (
        <Main>
            <Content />
        </Main>
    );
};

export default Page;

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
    color: var(--mrmr-secondary-color);
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

            <SubText style={{ marginBlockStart: "1rem" }}>
                <a href="https://github.com/mnvr/mrmr.io">Source code</a>
            </SubText>

            <SubText>
                <Link to="/">Home</Link>
            </SubText>
        </div>
    );
};
