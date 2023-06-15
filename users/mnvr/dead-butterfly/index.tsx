import { Column } from "components/Column";
import { NavA } from "components/NavA";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <ContentContainer>
            <Column>
                <Song />
                <Title page={page} />
                <Song2 />
                <Title2 page={page} />
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

const Song: React.FC = () => {
    return (
        <SongContainer>
            <p>
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
                Butterfly
            </p>
        </SongContainer>
    );
};

const Song2: React.FC = () => {
    return (
        <SongContainer>
            <p>
                Fly
                <br />
                Fly
                <br />
                Fly
                <br />
                Butterfly
            </p>
        </SongContainer>
    );
};

const SongContainer = styled.div`
    font-family: serif;
    font-size: 1.5rem;
    line-height: 2rem;
`;

const Title: React.FC<{ page: Page }> = ({ page }) => {
    const { title, user, formattedDateDMY } = page;
    const { firstName } = user;

    return (
        <TitleContainer>
            <>
                <TitleBold>{title}</TitleBold>
                <br />
                <small>
                    A song, by {firstName}, {formattedDateDMY}
                </small>
            </>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block: 8rem;
    color: var(--mrmr-color-2);
    opacity: 0.53;
`;

const TitleBold = styled.span`
    font-weight: 700;
    font-variant: small-caps;
`;

const Title2: React.FC<{ page: Page }> = ({ page }) => {
    return (
        <TitleContainer>
            <TitleBold>
                <NavContainer>
                    <NavA page={page} separator="•" />
                </NavContainer>
            </TitleBold>
        </TitleContainer>
    );
};

const NavContainer = styled.div`
    letter-spacing: 0.045ch;

    a {
        text-decoration: none;
    }

    a:hover {
        border-top: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
    }
`;