import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import {
    basicColorPalettes,
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import {
    BodyBackgroundColorTransitionStyle,
    PageListing,
} from "components/PageListing";
import { ParsedLinkButtonsB } from "components/ParsedLinkButtonsB";
import { graphql, HeadFC, PageProps } from "gatsby";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import { ParsedLink, parseUserLinks } from "parsers/links";
import { firstNameOrFallback } from "parsers/user";
import * as React from "react";
import styled from "styled-components";
import type { UserTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserTemplate: React.FC<
    PageProps<Queries.UserTemplateQuery, UserTemplateContext>
> = ({ data, pageContext, children }) => {
    const { username } = pageContext;
    const user = parseUser(data, username);
    const { pages } = user;

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    // If the user is hovering on the link to a page, use that page's colors.
    let colorPalettes = paletteSetOrFallback(
        hoverPage,
        user,
        basicColorPalettes
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

export const Head: HeadFC<Queries.UserTemplateQuery, UserTemplateContext> = ({
    data,
    pageContext,
}) => {
    const { username } = pageContext;
    const user = parseUser(data, username);

    const title = user.name;
    const description = `Music, words and art by ${user.firstName}`;
    const canonicalPath = user.slug;

    return <DefaultHead {...{ title, description, canonicalPath }} />;
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
    username: string;
    slug: string;
    name: string;
    firstName: string;
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

const parseUser = (data: Queries.UserTemplateQuery, username: string) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    let parsedUser: User | undefined;
    const pages: Page[] = [];
    nodes.forEach((node) => {
        const { frontmatter, fields } = node;
        const type = ensure(fields?.type);
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);
        const slug = ensure(fields?.slug);

        if (type == "user") {
            const name = ensure(frontmatter?.name);
            const links = parseUserLinks(frontmatter?.links);
            const flair = frontmatter?.flair;

            const firstName = firstNameOrFallback({ username, name });

            parsedUser = {
                username,
                slug,
                name,
                firstName,
                colors,
                darkColors,
                links,
                flair,
                pages: [],
            };
        } else {
            const title = ensure(frontmatter?.title);

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
            <ParsedLinkButtonsB links={links} />
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
    margin-block-start: 2rem;
    margin-block-end: 1.2rem;
    margin-inline: 0.1rem;

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        background-color: var(--mrmr-color-1-transparent);
    }
`;
