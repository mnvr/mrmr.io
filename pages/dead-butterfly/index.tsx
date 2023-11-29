import { Column } from "components/Column";
import { Link } from "gatsby";
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
                <Title2 />
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
    line-height: 1.33;
`;

const Title: React.FC<{ page: Page }> = ({ page }) => {
    const { title, formattedDateDMY } = page;

    return (
        <Title_>
            <>
                <TitleBold>{title}</TitleBold>
                <br />
                <small>A song, by Manav, {formattedDateDMY}</small>
            </>
        </Title_>
    );
};

const Title_ = styled.div`
    margin-block: 8rem;
    color: var(--mrmr-color-2);
    opacity: 0.53;
`;

const TitleBold = styled.span`
    font-weight: 700;
`;

const Title2: React.FC = () => {
    return (
        <Title2_>
            <TitleBold>
                <small>
                    <Link to="/">Home</Link>
                </small>
            </TitleBold>
        </Title2_>
    );
};

const Title2_ = styled.div`
    margin-block: 8rem;
    color: var(--mrmr-color-2);

    a {
        text-decoration: none;
        font-weight: 500;
        opacity: 0.53;
    }

    a:hover {
        opacity: 0.9;
    }
`;
