import { Column } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
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
    color: var(--mrmr-secondary-color);
`;

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <LinkStyleUnderlined>
                <Link to="/">Home</Link>
            </LinkStyleUnderlined>
        </Footer_>
    );
};

const Footer_ = styled.div`
    margin-block-start: 7rem;
    margin-block-end: 4rem;
    font-size: 0.8rem;
`;

export const HRT = styled.hr`
    width: 50%;
    margin-block: 2rem;
`;

export const HRMQ = styled.hr`
    margin-block-start: 3rem;
`;

export const MarginQuote = styled.p`
    color: var(--mrmr-secondary-color);
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
    color: var(--mrmr-secondary-color);
`;

export const Aside: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <small>
            <AsideBQ>{children}</AsideBQ>
        </small>
    );
};

const AsideBQ = styled.blockquote`
    color: var(--mrmr-secondary-color);
    border-inline-start: 2px dotted var(--mrmr-secondary-color);
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
