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
import { useFlair } from "hooks/flairs";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import { ParsedLink, parseUserLinks } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserPage: React.FC<PageProps<Queries.UserIndexQuery>> = ({
    data,
    children,
}) => {
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

export default UserPage;

export const Head: HeadFC<Queries.UserIndexQuery> = ({ data }) => {
    const { name } = parseUser(data);

    return <DefaultHead title={name} />;
};

export const query = graphql`
    query UserIndex($username: String!) {
        allMdx(
            filter: { fields: { username: { eq: $username } } }
            sort: { frontmatter: { date: DESC } }
        ) {
            nodes {
                frontmatter {
                    name
                    title
                    colors
                    dark_colors
                    links
                    flairs
                }
                fields {
                    slug
                    template
                }
            }
        }
    }
`;

interface User {
    name: string;
    flairs?: string[];
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

const parseUser = (data: Queries.UserIndexQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    let parsedUser: User | undefined;
    const pages: Page[] = [];
    nodes.forEach((node) => {
        const { frontmatter, fields } = node;
        const template = ensure(fields?.template);
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);

        if (template == "user") {
            const name = ensure(frontmatter?.name);
            const links = parseUserLinks(frontmatter?.links);
            const flairs = frontmatter?.flairs?.filter(isDefined);

            parsedUser = { name, colors, darkColors, links, flairs, pages: [] };
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

const Header: React.FC<User> = ({ name, flairs, links }) => {
    const flair = useFlair(flairs);

    return (
        <>
            <H1>{name}</H1>
            {flair && <Flair>{flair}</Flair>}
            {links && <LinkButtons links={links} />}
        </>
    );
};

const H1 = styled.h1`
    margin-top: 2rem;
`;

const Flair: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <FlairContainer>
            <small>{children}</small>
        </FlairContainer>
    );
};

const FlairContainer = styled.p`
    font-style: italic;
    margin-top: -1rem;
    padding-inline-start: 0.05rem;
    opacity: 0.8;
`;

interface LinkButtonsProps {
    links: ParsedLink[];
}

const LinkButtons: React.FC<LinkButtonsProps> = ({ links }) => {
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtons links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    a {
        opacity: 0.7;
    }

    a:hover {
        opacity: 1;
    }
`;

const UserMarkdownContainer = styled.div<User>`
    margin-top: 2rem;

    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        background-color: var(--mrmr-color-1-transparent);
    }
`;
