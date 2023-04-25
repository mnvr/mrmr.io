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
                {/* <Title /> */}
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

const PoemContainer = styled.div`
    font-family: serif;
    font-size: 1.5rem;
`;

const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, user, formattedDateDMY } = page;
    const { name } = user;

    return (
        <TitleContainer>
            <p>
                <b>{title}</b>
                <br />
                <Caption>
                    {name}, <small>{formattedDateDMY}</small>
                </Caption>
            </p>
            <NavContainer>
                <NavA page={page} />
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
