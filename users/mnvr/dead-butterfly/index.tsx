import { Column } from "components/Column";
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
                <Poem2 />
            </Column>
        </ContentContainer>
    );
};

const ContentContainer = styled.div`
    margin-block: 4rem;
    margin-inline: 0.5rem;
    @media (min-width: 360px) {
        margin-inline: 1rem;
    }
`;

const Poem: React.FC = () => {
    const spreadOut = { lineHeight: "2rem" };

    return (
        <PoemContainer>
            <p style={spreadOut}>
                Dead butterfly
                <br />
                Why don't you <i>flutter</i> your wings?
            </p>
            <p>
                Dead
                <br />
                Dead
                <br />
                Dead
                <br />
                <span style={spreadOut}>Butterfly</span>
            </p>
        </PoemContainer>
    );
};


const Poem2: React.FC = () => {
    const spreadOut = { lineHeight: "2rem" };

    return (
        <PoemContainer>
            <p style={spreadOut}>
                Fly
                <br />
                Fly
                <br />
                Fly
                <br />
                <span >Butterfly</span>
            </p>
        </PoemContainer>
    );
};

const PoemContainer = styled.div`
    font-family: serif;
    font-size: 1.5rem;
    line-height: 2rem;
`;

const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, user, formattedDateDMY } = page;
    const { name } = user;

    return (
        <TitleContainer>
            <small style={{ marginBlockEnd: "0px" }}>
                <b>{title}</b><br/>
                {/* <Caption>
                    {name}, <small>{formattedDateDMY}</small>
                </Caption> */}
            <span style={{ fontVariant: "normal" }}>
                <small> A song, by Manav, 24 April 2023</small>
            </span>
            </small>
            {/* <NavContainer>
                <NavA page={page} />
            </NavContainer> */}
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block-start: 8rem;
    margin-block-end: 8rem;
    /* line-height: 2.85rem; */
    font-variant: small-caps;
    color: var(--mrmr-color-2);
    opacity: 0.53;

`;

const Caption = styled.small`
    color: var(--mrmr-color-2);
`;

const NavContainer = styled.div`
    margin-block-start: 4rem;

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
