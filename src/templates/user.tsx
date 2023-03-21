import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import {
    BodyBackgroundColorTransitionStyle,
    PageListing,
} from "components/PageListing";
import { ParsedLinkButtons } from "components/ParsedLinks";
import { graphql, HeadFC, PageProps } from "gatsby";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import { ParsedLink, parseUserLinks } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import type { UserTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserTemplate: React.FC<
    PageProps<Queries.UserTemplateQuery, UserTemplateContext>
> = ({ data, children }) => {
    const user = parseUser(data);
    const { pages } = user;

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    // If the user is hovering on the link to a page, use that page's colors.
    let colorPalettes = paletteSetOrFallback(
        [hoverPage?.colors, hoverPage?.darkColors],
        paletteSetOrFallback([user.colors, user.darkColors])
    );

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <BodyBackgroundColorTransitionStyle />
            <Column>
                <Header {...user} />
                <UserMarkdownContainer {...user}>
                    {children}
                </UserMarkdownContainer>
                <PageListing {...{ pages, setHoverPage }} />
            </Column>
        </main>
    );
};

export default UserTemplate;

export const Head: HeadFC<Queries.UserTemplateQuery> = ({ data }) => {
    const { name } = parseUser(data);

    return <DefaultHead title={name} />;
};

export const query = graphql`
    query UserTemplate($username: String!) {
        allMdx(
            filter: { fields: { username: { eq: $username } } }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    name
                    title
                    colors
                    dark_colors
                    flair
                    links
                }
                fields {
                    slug
                    type
                }
            }
        }
    }
`;

interface User {
    name: string;
    flair?: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    pages: Page[];
    links?: ParsedLink[];
}

interface Page {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

const parseUser = (data: Queries.UserTemplateQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    let parsedUser: User | undefined;
    const pages: Page[] = [];
    nodes.forEach((node) => {
        const { frontmatter, fields } = node;
        const type = ensure(fields?.type);
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);

        if (type == "user") {
            const name = ensure(frontmatter?.name);
            const links = parseUserLinks(frontmatter?.links);
            const flair = frontmatter?.flair;

            parsedUser = { name, colors, darkColors, links, flair, pages: [] };
        } else {
            const title = ensure(frontmatter?.title);
            const slug = ensure(fields?.slug);

            const page = { title, slug, colors, darkColors };

            pages.push(page);
        }
    });

    const user = ensure(parsedUser);
    return { ...user, pages };
};

const Header: React.FC<User> = ({ name, flair, links }) => {
    return (
        <>
            <H1>{name}</H1>
            {flair && <Flair>{flair}</Flair>}
            {links && <UserLinks links={links} />}
        </>
    );
};

const H1 = styled.h1`
    margin-block-start: 2rem;
`;

const Flair: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <FlairContainer>
            <small>{children}</small>
        </FlairContainer>
    );
};

interface UserLinksProps {
    links: ParsedLink[];
}

const UserLinks: React.FC<UserLinksProps> = ({ links }) => {
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtons links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    a {
        color: var(--mrmr-color-4);
    }

    a:hover {
        color: var(--mrmr-color-3);
    }
`;

const FlairContainer = styled.p`
    font-style: italic;
    margin-block-start: -1rem;
    padding-inline-start: 0.05rem;
    opacity: 0.8;
`;

const UserMarkdownContainer = styled.div<User>`
    margin-block-start: 2.5rem;
    margin-block-end: 1.5rem;

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        background-color: var(--mrmr-color-1-transparent);
    }
`;
