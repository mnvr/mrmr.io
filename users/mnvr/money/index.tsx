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
    margin-block-start: 4rem;
    line-height: 1.5rem;
`;

const Caption = styled.small`
    color: var(--mrmr-color-2);
`;

interface NavProps {
    page: Page;
}

const Nav: React.FC<NavProps> = ({ page }) => {
    const { links } = page;

    return (
        <NavContainer>
            <p>
                <small>
                    {/* Share /{" "} */}
                    <ExternalLink
                        href={links.sourceLink.url}
                        title={links.sourceLink.title}
                    >
                        Remix
                    </ExternalLink>{" "}
                    /{" "}
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
