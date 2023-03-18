import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import { ColorPalette, parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * List "some" pages. Currently it shows all the pages, sorted by recency.
 */
const SomePage: React.FC<PageProps<Queries.SomePageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <PageListing {...{ pages }} />
        </main>
    );
};

const colorPalettes = {
    colors: ensure(parseColorPalette(["hsl(0, 0%, 100%)", "hsl(0, 0%, 13%)"])),
    darkColors: parseColorPalette(["hsl(240, 6%, 20%)", "hsl(240, 12%, 90%)"]),
};

export default SomePage;

export const Head: HeadFC = () => <DefaultHead />;

/**
 * Fetch all pages, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted` (e.g. pages of the "_example"
 *   user).
 * - Right now this returns all pages; if this list grows too big then we add a
 *   limit here too.
 */
export const query = graphql`
    query SomePage {
        allMdx(
            filter: {
                fields: { template: { eq: "page" } }
                frontmatter: { unlisted: { ne: true } }
            }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    title
                    colors
                    dark_colors
                }
                fields {
                    slug
                    username
                }
            }
        }
    }
`;

interface Page {
    title: string;
    slug: string;
    username: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

const parsePages = (data: Queries.SomePageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const title = ensure(frontmatter?.title);
        const slug = ensure(fields?.slug);
        const username = ensure(fields?.username);
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);

        return { title, slug, username, colors, darkColors };
    });
};

const PageListing: React.FC<{ pages: Page[] }> = ({ pages }) => {
    return (
        <Column>
            <UL>
                {pages.map((page) => (
                    <LI key={page.slug} {...createLIProps(page)}>
                        <PageLink {...page} />
                    </LI>
                ))}
            </UL>
        </Column>
    );
};

const UL = styled.ul`
    font-family: serif;
    font-style: italic;

    a {
        opacity: 0.9;
        text-decoration: none;
    }

    a:hover {
        background-color: var(--mrmr-color-1-transparent);
    }

    .userinfo {
        opacity: 0.7;
    }

    .userinfo a {
        border-bottom: none;
    }

    .userinfo a:hover {
        background-color: var(--mrmr-color-1-transparent);
    }
`;

interface LIProps {
    color: string;
    hoverColor: string;
    darkColor: string;
    darkHoverColor: string;
}

const createLIProps = ({ colors, darkColors }: Page) => {
    return {
        color: colors?.backgroundColor1 ?? "var(--mrmr-color-1-transparent)",
        hoverColor:
            colors?.backgroundColor1Transparent ??
            "var(--mrmr-background-color-1-transparent)",
        darkColor:
            darkColors?.backgroundColor1 ??
            colors?.backgroundColor1 ??
            "var(--mrmr-color-1-transparent)",
        darkHoverColor:
            darkColors?.backgroundColor1Transparent ??
            colors?.backgroundColor1Transparent ??
            "var(--mrmr-background-color-1-transparent)",
    };
};

const LI = styled.li<LIProps>`
    ::marker {
        color: ${(props) => props.color};
    }

    a {
        border-bottom: 1px solid ${(props) => props.color};
    }

    a:hover {
        background-color: ${(props) => props.hoverColor};
    }

    @media (prefers-color-scheme: dark) {
        ::marker {
            color: ${(props) => props.darkColor};
        }

        a {
            border-bottom: 1px solid ${(props) => props.darkColor};
        }

        a:hover {
            background-color: ${(props) => props.darkHoverColor};
        }
    }
`;

const PageLink: React.FC<Page> = ({ title, slug, username }) => {
    const userSlug = `/${username}`;
    return (
        <>
            <Link to={slug}>{title.toLowerCase()}</Link>
            <span className="userinfo">
                {" "}
                by{" "}
                <Link to={userSlug} className="noborder">
                    @{username}
                </Link>
            </span>
        </>
    );
};
