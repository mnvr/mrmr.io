import { Column } from "components/Column";
import { NavA } from "components/NavA";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    return (
        <ContentContainer>
            <Column>
                <Poem />
                <Title />
            </Column>
        </ContentContainer>
    );
};

const ContentContainer = styled.div`
    margin-block: 3rem;
    margin-inline: 0.5rem;
    @media (min-width: 360px) {
        margin-inline: 1rem;
    }

    line-height: 1.5rem;
`;

const Poem: React.FC = () => {
    return (
        <>
            <p>
                I never paid the children
                <br />
                whose smiles made me smile
                <br />
                Trees whose leaves gave me shade
                <br />
                And breath
                <br />
                And the mountains that took it away
            </p>
            <p>Yet I need money</p>
        </>
    );
};

export const AuthorAndDate: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;
    return (
        <TitleContainer>
            <Caption>Manav Rathi, {formattedDateMY}</Caption>
        </TitleContainer>
    );
};

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

export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    return (
        <TitleContainer>
            <NavContainer>
                <hr />
                <NavA page={page} />
            </NavContainer>
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

const NavContainer = styled.div`
    /* margin-block-start: 4rem; */

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
