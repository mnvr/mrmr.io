import { Link } from "gatsby";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { Column } from "./Column";
import { ParsedLinkButtons } from "./ParsedLinks";

/**
 * A footer for a page template - Variant A.
 *
 * This component is meant to be used within the footer of a page that is being
 * rendered using `template/page.tsx`. In particular, it assumes that a
 * {@link BuildTimePageContext} has been provided - that's where it gets the
 * list of links and other data that it needs from.
 */
export const PageFooterA: React.FC = () => {
    const { links } = ensure(React.useContext(BuildTimePageContext));

    return (
        <Column>
            {links && <PageLinks links={links} />}
            <HomeContainer>
                Manav Rathi
                <br />
                <small>
                    Feb 2023
                    <br />
                    <br />
                    <Link to="/mnvr">more...</Link>
                </small>
            </HomeContainer>
        </Column>
    );
};

interface PageLinksProps {
    links: ParsedLink[];
}

const PageLinks: React.FC<PageLinksProps> = ({ links }) => {
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtons links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block-start: 3rem;
    margin-block-end: 2.25rem;

    a {
        opacity: 0.8;
    }

    a:hover {
        color: var(--mrmr-color-3);
        opacity: 1;
    }
`;

const HomeContainer = styled.div`
    margin-inline: 0.3rem;
    margin-block-start: 0.6rem;
    margin-block-end: 6rem;
    font-size: 0.9rem;

    opacity: 0.5;

    a {
        text-decoration: none;
    }

    a:hover {
        color: var(--mrmr-color-3);
        border-bottom: 1px solid currentColor;
    }
`;
