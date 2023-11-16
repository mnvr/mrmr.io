import { Column } from "components/Column";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Column>
            <ContentContainer>{children}</ContentContainer>
        </Column>
    );
};

const ContentContainer = styled.div`
    margin-block: 2rem;

    hr {
        opacity: 0.075;
        @media (prefers-color-scheme: dark) {
            opacity: 0.15;
        }
    }
`;

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <h1>RLHF is like the left/right brain split</h1>
            <Caption>
                Manav Rathi
                <br />
                {formattedDateMY}
            </Caption>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block-start: 2rem;
    margin-block-end: 4rem;
    @media (min-width: 600px) {
        margin-block-start: 3rem;
        margin-block-end: 5rem;
    }
`;

const Caption = styled.small`
    color: var(--mrmr-color-3);
`;

export const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <small>
                <Link to="/">Home</Link>
            </small>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block-start: 7rem;
    margin-block-end: 4rem;

    a {
        text-decoration: none;
        font-weight: 500;
    }

    a:hover {
        color: var(--mrmr-color-2);
    }
`;

export const HRT = styled.hr`
    width: 50%;
    margin-block: 2rem;
`;

export const HRMQ = styled.hr`
    margin-block-start: 3rem;
`;

export const MarginQuote = styled.p`
    color: var(--mrmr-color-3);
    font-family: serif;
    font-style: italic;
    margin-block-start: 1.5rem;
    margin-block-end: 2rem;
`;

export const Example = styled.blockquote`
    color: royalblue;
    @media (prefers-color-scheme: dark) {
        color: paleturquoise;
    }
    font-family: serif;
    font-style: italic;
`;

export const Sub = styled.span`
    color: var(--mrmr-color-3);
`;

export const Aside: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <small>
            <AsideBQ>{children}</AsideBQ>
        </small>
    );
};

const AsideBQ = styled.blockquote`
    color: var(--mrmr-color-3);
    border-inline-start: 2px dotted var(--mrmr-color-3);
    margin-inline-start: 0.1rem;
    padding-inline-start: 0.5rem;
`;

export const Cmp = styled.span`
    background-color: honeydew;
    color: darkgreen;
    @media (prefers-color-scheme: dark) {
        background-color: darkgreen;
        color: honeydew;
    }
`;
