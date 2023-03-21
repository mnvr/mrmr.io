import { Link } from "gatsby";
import { ParsedLink } from "parsers/links";
import { firstNameOrFallback } from "parsers/user";
import * as React from "react";
import { RxSlash } from "react-icons/rx";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
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
    const page = ensure(React.useContext(BuildTimePageContext));
    const { links } = page;

    return (
        <Column>
            {links && <PageLinks links={links} />}
            <PageInfo page={page} />
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
        color: var(--mrmr-color-4);
    }

    a:hover {
        color: var(--mrmr-color-3);
    }
`;

interface PageInfoProps {
    page: Page;
}

const PageInfo: React.FC<PageInfoProps> = ({ page }) => {
    const { formattedDateMY, user } = page;
    const { slug, name } = user;
    const firstName = firstNameOrFallback(user);

    return (
        <PageInfoContents>
            <DetailsContainer>
                {name}
                <br />
                <small>{formattedDateMY}</small>
            </DetailsContainer>
            <HomeLinkContainer>
                <Link to={slug}>
                    <RxSlash title={`More by ${firstName}`} />
                </Link>
            </HomeLinkContainer>
        </PageInfoContents>
    );
};

const PageInfoContents = styled.div`
    margin-block-start: 0.6rem;
    margin-block-end: 6rem;
    font-size: 0.9rem;
`;

const DetailsContainer = styled.div`
    margin-inline: 0.3rem;
    opacity: 0.5;

    margin-block-end: 2rem;
`;

const HomeLinkContainer = styled.div`
    margin-inline: 0.07rem;

    a {
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        opacity: 1;
    }
`;
