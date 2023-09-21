import { NavA } from "components/NavA";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <p>
                <h1>RLHF is like the left/right brain split</h1>
                <Caption>
                    Manav Rathi
                    <br />
                    {formattedDateMY}
                </Caption>
            </p>
        </TitleContainer>
    );
};

export const MarginQuote = styled.p`
    color: var(--mrmr-color-2);
    font-family: serif;
    font-style: italic;
    margin-block-end: 2rem;
`;

export const Aside = styled.span`
    color: var(--mrmr-color-2);
`;

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
            <FooterHR />
            <NavContainer>
                <NavA page={page} />
            </NavContainer>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block: 4rem;
`;

const FooterHR = styled.hr`
    margin-block-end: 2rem;
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
