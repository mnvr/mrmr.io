import { ExternalLink } from "components/ExternalLink";
import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { Link, graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";
import { BsArrowRightShort, BsMastodon } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import styled from "styled-components";
import { frontPageTheme } from "themes/themes";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const Page: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const recentPages = parseRecentPages(data);

    let colorPalettes = paletteSetOrFallback(frontPageTheme);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <RecentPagesTitle />
            <RecentPageListing pages={recentPages} />
            <AboutSectionTitle />
            <ExternalLinks />
            <InternalLinks />
        </main>
    );
};

export default Page;

export const Head: HeadFC<Queries.IndexPageQuery> = ({ data }) => {
    const description = "words | colors / music •◦◎◉⦿ code";
    const canonicalPath = "";

    const file = replaceNullsWithUndefineds(data.file);
    const previewImagePath = getSrc(ensure(file));

    return (
        <DefaultHead {...{ description, canonicalPath, previewImagePath }} />
    );
};

/**
 * Fetch the data needed by the home page.
 *
 * - In particular, fetch the preview (meta/og:image) image.
 *
 * Fetch a few recent pages (what'd be shown in '/all'), sorted by recency.
 *
 * Fetch all pages tagged "front-page", sorted by recency.
 *
 * Fetch all page preview images ("preview.png/jpg").
 *
 * - These images will be shown in the `PageItem` component in
 *   `components/index/FeaturePageListing.tsx`, which has a fixed width and
 *   height – `13.7ch` and `9.7ch` respectively. These have an aspect ratio of
 *   1.4, but we set an aspect ratio of 2 so that the image doesn't ever
 *   overflow the height; visually, this is fine since we also have a
 *   transparent opacity gradient for the image so the top portion will anyways
 *   be cutoff.
 */
export const query = graphql`
    query IndexPage {
        file(
            relativePath: { eq: "index/preview.png" }
            sourceInstanceName: { eq: "assets" }
        ) {
            childImageSharp {
                gatsbyImageData
            }
        }
        recentPages: allMdx(
            limit: 70
            filter: { frontmatter: { unlisted: { ne: true } } }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    title
                    description
                }
                fields {
                    slug
                }
            }
        }
        featuredPages: allMdx(
            filter: {
                frontmatter: {
                    attributes: { in: "front-page" }
                }
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
                }
            }
        }
        previewImages: allFile(
            filter: {
                sourceInstanceName: { eq: "pages" },
                ext: { regex: "/\\.(jpg|png)/" }
                name: { eq: "preview" }
            }
        ) {
            nodes {
                relativeDirectory
                childImageSharp {
                    gatsbyImageData(
                        layout: FIXED
                        width: 200
                        placeholder: NONE
                    )
                }
            }
        }
    }
`;

interface RecentPage {
    title: string;
    slug: string;
    description?: string;
}

const parseRecentPages = (data: Queries.IndexPageQuery): RecentPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.recentPages);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const description = frontmatter?.description;

        return { slug, title, description };
    });
};

interface SectionTitleProps {
    $marginBlockStart?: string /* default: 2.6rem */;
    $marginBlockEnd?: string /* default: 2.6rem */;
}

const SectionTitle = styled.div<SectionTitleProps>`
    margin-block-start: ${(props) => props.$marginBlockStart ?? "2.6rem"};
    margin-block-end: ${(props) => props.$marginBlockEnd ?? "2.6rem"};
    margin-inline-start: 1.7rem;
    @media (max-width: 500px) {
        margin-inline-start: 1rem;
    }
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-tertiary-color);
`;

const RecentPagesTitle: React.FC = () => {
    return (
        <SectionTitle $marginBlockEnd="2.5rem">
            <h2>here</h2>
        </SectionTitle>
    );
};

const AboutSectionTitle: React.FC = () => {
    return (
        <SectionTitle $marginBlockEnd="2.4rem">
            <h2>elsewhere</h2>
        </SectionTitle>
    );
};

interface RecentPageListingProps {
    pages: RecentPage[];
}

const RecentPageListing: React.FC<RecentPageListingProps> = ({ pages }) => {
    return (
        <RecentPageListing_>
            {pages.map((page) => (
                <RecentPageItem key={page.slug} {...page} />
            ))}
        </RecentPageListing_>
    );
};

const RecentPageListing_ = styled.ul`
    margin-inline: 2rem;
    @media (max-width: 500px) {
        margin-inline: 1rem;
    }

    list-style: none;
    padding-inline-start: 0;

    line-height: 1.4rem;

    a {
        text-decoration: none;
        font-weight: 600;
    }

    a:visited {
        color: var(--mrmr-secondary-color);
    }

    a:hover {
        color: var(--mrmr-title-color);

        background-color: oklch(96.74% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: oklch(41.14% 0.021 285.75);
        }
    }
`;

const RecentPageItem: React.FC<RecentPage> = ({ title, description, slug }) => {
    return (
        <li>
            <Link to={slug}>{title}</Link>
            {description && (
                <RecentPageDescription>
                    {" – "}
                    {description}
                </RecentPageDescription>
            )}
        </li>
    );
};

const RecentPageDescription = styled.span`
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-tertiary-color);
`;

const ExternalLinks: React.FC = () => {
    return (
        <LinkButtonsContainer>
            <ExternalLink href="https://github.com/mnvr">
                <IconContainer>
                    <FiGithub title="GitHub" />
                </IconContainer>
            </ExternalLink>

            <ExternalLink href="https://twitter.com/mnvrth">
                <IconContainer>
                    <FaTwitter title="Twitter" />
                </IconContainer>
            </ExternalLink>

            <ExternalLink href="https://mastodon.social/@mnvr">
                <IconContainer>
                    <BsMastodon size="0.95em" title="Mastodon" />
                </IconContainer>
            </ExternalLink>
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block: 2rem;
    margin-inline-start: 1.7rem;
    @media (max-width: 500px) {
        margin-inline: 1rem;
    }

    display: flex;
    flex-wrap: wrap;
    gap: 1.3rem;

    a {
        color: var(--mrmr-tertiary-color);
    }

    a:hover {
        color: var(--mrmr-title-color);
    }
`;

const IconContainer = styled.div`
    /** Ensure sufficient tap area for mobile devices */
    min-width: 44px;
    min-height: 44px;

    /**
     * Center the SVG within the tap area if the SVG is smaller than the mininum
     * dimensions (this'll usually be the case).
     */
    display: flex;
    justify-content: center;
    align-items: center;

    /* Show the hand icon on hover */
    cursor: pointer;

    /* Set the size of the icon */
    font-size: 1.9rem;
`;

const InternalLinks: React.FC = () => {
    return (
        <InternalLinks_>
            <div>
                <a href="https://poems.mrmr.io">
                    <h2>
                        poems
                        <BsArrowRightShort />
                    </h2>
                </a>
            </div>
            <div>
                <a href="https://notes.mrmr.io">
                    <h2>
                        notes
                        <BsArrowRightShort />
                    </h2>
                </a>
            </div>
        </InternalLinks_>
    );
};

const InternalLinks_ = styled.div`
    margin-block-start: 2.8rem;
    margin-block-end: 2.9rem;
    margin-inline-start: 1.7rem;
    @media (max-width: 500px) {
        margin-inline: 1rem;
    }

    display: flex;
    flex-direction: column;
    gap: 2rem;

    font-family: serif;
    font-style: italic;

    h2 {
        padding: 0;
        margin: 0;
        display: inline-block;
    }

    h2 > svg {
        /* vertically align in the content box */
        vertical-align: middle;
        /* but we need to shove a few more pixels in to get it to
           visually align too */
        margin-block-end: 2px;
        /* also add a bit of extra space between the text and the icon */
        padding-inline-start: 1px;
    }

    a {
        color: var(--mrmr-tertiary-color);
        text-decoration: none;
    }

    a:hover {
        color: var(--mrmr-title-color);
    }
`;
