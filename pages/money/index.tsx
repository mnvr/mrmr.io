import { Column } from "components/Column";
import { Link } from "gatsby";
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

const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, formattedDateMY } = page;

    return (
        <TitleContainer>
            <p>
                <b>{title}</b>
                <br />
                <Caption>Manav Rathi, {formattedDateMY}</Caption>
            </p>
            <NavContainer>
                <small>
                    <Link to="/">Home</Link>
                </small>
            </NavContainer>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block-start: 4rem;
    line-height: 1.5rem;
`;

const Caption = styled.small`
    color: var(--mrmr-color-2);
`;

const NavContainer = styled.div`
    margin-block-start: 4rem;

    color: var(--mrmr-color-2);

    a {
        text-decoration: none;
        color: var(--mrmr-color-3);
        font-weight: 500;
        opacity: 0.5;
    }

    a:hover {
        color: var(--mrmr-color-1);
        opacity: 1;
    }
`;
