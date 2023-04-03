import { Column } from "components/Column";
import { ExternalLink } from "components/ExternalLink";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
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
`;

const Poem: React.FC = () => {
    return (
        <PoemContainer>
            <p>
                I never paid the children
                <br />
                whose smiles made me smile
                <br />
                The trees whose leaves gave me shade
                <br />
                And breath
                <br />
                And the mountains that took it away
            </p>
            <p>Yet I need money</p>
        </PoemContainer>
    );
};

const PoemContainer = styled.div`
    line-height: 1.35rem;
`;

const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, user, formattedDateMY } = page;
    const { name } = user;

    return (
        <TitleContainer>
            <p>
                <b>{title}</b>
                <br />
                <Caption>
                    {name}, {formattedDateMY}
                </Caption>
            </p>
            <Nav page={page} />
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block-start: 4.4rem;
    line-height: 1.3rem;
`;

const Caption = styled.small`
    color: var(--mrmr-color-2);
`;

interface NavProps {
    page: Page;
}

const Nav: React.FC<NavProps> = ({ page }) => {
    const { user, links } = page;
    const { slug, firstName } = user;

    return (
        <NavContainer>
            <p>
                <small>
                    Share |{" "}
                    <ExternalLink
                        href={links.sourceLink.url}
                        title={links.sourceLink.title}
                    >
                        Remix
                    </ExternalLink>{" "}
                    |{" "}
                    <Link
                        to={links.userPageLink.slug}
                        title={links.userPageLink.title}
                    >
                        More
                    </Link>
                </small>
            </p>
        </NavContainer>
    );
};

const NavContainer = styled.div`
    margin-block-start: 3.25rem;

    a {
        text-decoration: none;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
    }
`;
