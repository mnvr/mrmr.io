import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import {
    BodyBackgroundColorTransitionStyle,
    FeaturedPage,
    FeaturedPageListing,
} from "components/index/FeaturedPageListing";
import { ParsedLinkButtons } from "components/index/ParsedLinkButtons";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import { parseColorPalette } from "parsers/colors";
import { parseLinks } from "parsers/links";
import * as React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";
import { frontPageTheme } from "themes/themes";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const recentPages = parseRecentPages(data);
    const featuredPages = parseFeaturedPages(data);

    const [hoverPage, setHoverPage] = React.useState<
        FeaturedPage | undefined
    >();

    // If the user is hovering on the link to a page, use that page's colors.
    // Otherwise use the index pages' own color palette.
    let colorPalettes = paletteSetOrFallback(hoverPage, frontPageTheme);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <BodyBackgroundColorTransitionStyle />
            <RecentPagesTitle />
            <RecentPageListing pages={recentPages} />
            <FeaturedPagesTitle />
            <FeaturedPageListing {...{ pages: featuredPages, setHoverPage }} />
            <AboutSectionTitle />
            <Poem />
            <ExternalLinks />
            <InternalLinks />
        </main>
    );
};

export default IndexPage;

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
 * Fetch a few recent of pages in the '/all' feed, sorted by recency.
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
            limit: 7
            filter: { fields: { feed: { eq: "/all" } } }
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
                    gatsbyImageData(aspectRatio: 2)
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

const parseFeaturedPages = (data: Queries.IndexPageQuery): FeaturedPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.featuredPages);
    const nodes = allMdx.nodes;

    const previewImages = replaceNullsWithUndefineds(data.previewImages);
    const previewImageForPage = (slug: string) =>
        previewImages.nodes.find((pi) => `/${pi.relativeDirectory}` === slug);

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);
        const slug = ensure(fields?.slug);
        const title = ensure(frontmatter?.title);

        const previewImage = previewImageForPage(slug);

        return { title, slug, colors, darkColors, previewImage };
    });
};

interface SectionTitleProps {
    marginBlockStart?: string /* default: 2.6rem */;
    marginBlockEnd?: string /* default: 2.6rem */;
}

const SectionTitle = styled.div<SectionTitleProps>`
    margin-block-start: ${(props) => props.marginBlockStart ?? "2.6rem"};
    margin-block-end: ${(props) => props.marginBlockEnd ?? "2.6rem"};
    margin-inline-start: 1.7rem;
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-color-4);
`;

const RecentPagesTitle: React.FC = () => {
    return (
        <SectionTitle marginBlockEnd="2.5rem">
            <h2>recent posts</h2>
        </SectionTitle>
    );
};

const FeaturedPagesTitle: React.FC = () => {
    return (
        <SectionTitle>
            <h2>sights and sounds</h2>
        </SectionTitle>
    );
};

const AboutSectionTitle: React.FC = () => {
    return (
        <SectionTitle marginBlockEnd="2.4rem">
            <h2>about</h2>
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

    list-style: none;
    padding-inline-start: 0;

    line-height: 1.3;

    a {
        text-decoration: none;
        font-weight: 600;
    }

    a:visited {
        color: var(--mrmr-color-3);
    }

    a:hover {
        color: var(--mrmr-color-2);

        background-color: oklch(96.74% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: oklch(41.14% 0.021 285.75);
        }
    }
`;

const RecentPageItem: React.FC<RecentPage> = ({ title, description, slug }) => {
    return (
        <li>
            <Link to={slug}>{title}</Link>.{" "}
            <RecentPageDescription>{description}</RecentPageDescription>
        </li>
    );
};

const RecentPageDescription = styled.span`
    font-family: serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--mrmr-color-3);
`;

const Poem: React.FC = () => {
    return (
        <Poem_>
            <i><b>m</b>u<b>rm</b>u<b>r</b></i> to me softly
            <br />
            &nbsp;&nbsp;they tell me <i>it’s all right</i>
            <br />
            in the <i>wind</i> rustle leaves
            <br />
            &nbsp;&nbsp;the moon, and the <i>night</i>
        </Poem_>
    );
};

const Poem_ = styled.p`
    margin-inline-start: 2rem;
    font-family: serif;
    line-height: 1.2;
    color: var(--mrmr-color-3);
`;

const ExternalLinks: React.FC = () => {
    const links = parseLinks([
        "https://github.com/mnvr",
        "https://twitter.com/mnvrth",
        "https://instagram.com/manavrt",
        "https://youtube.com/@mnvrth",
    ]);
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtons links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block: 2rem;
    margin-inline-start: 1.7rem;

    a {
        color: var(--mrmr-color-4);
    }

    a:hover {
        color: var(--mrmr-color-2);
    }
`;

const InternalLinks: React.FC = () => {
    return (
        <InternalLinks_>
            <Link to="/all" title="All posts">
                <h2>
                    all posts
                    <BsArrowRightShort />
                </h2>
            </Link>
        </InternalLinks_>
    );
};

const InternalLinks_ = styled.div`
    margin-block-start: 2.6rem;
    margin-block-end: 2.6rem;
    margin-inline-start: 1.7rem;
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
        color: var(--mrmr-color-4);
        text-decoration: none;
    }

    a:hover {
        color: var(--mrmr-color-2);
    }
`;
