import { Column } from "components/Column";
import { NavA } from "components/NavA";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";


export const ContentContainer: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <Column>
            <ContentContainer2>{children}</ContentContainer2>
        </Column>
    );
};

const ContentContainer2 = styled.div`
    margin-block: 2rem;
`;

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <p>
                <h1>Test</h1>
                <Caption>
                    Manav Rathi
                    <br />
                    {formattedDateMY}
                </Caption>
            </p>
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
    color: var(--mrmr-color-2);
`;

export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <FooterContainer>
            <NavContainer>
                <NavA page={page} />
            </NavContainer>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block-start: 7rem;
    margin-block-end: 4rem;
`;

const NavContainer = styled.div`
    letter-spacing: 0.045ch;

    color: var(--mrmr-color-2);

    a {
        text-decoration: none;
        opacity: 0.8;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
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
    color: var(--mrmr-color-2);
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
    color: var(--mrmr-color-2);
`;

export const Aside: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <small>
            <AsideBQ>{children}</AsideBQ>
        </small>
    );
};

const AsideBQ = styled.blockquote`
    color: var(--mrmr-color-2);
    border-inline-start: 2px dotted var(--mrmr-color-2);
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
