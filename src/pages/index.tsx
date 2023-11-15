import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import {
    BodyBackgroundColorTransitionStyle,
    FeaturedPageListing,
} from "components/index/FeaturedPageListing";
import { ParsedLinkButtons } from "components/index/ParsedLinkButtons";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import { parseLinks } from "parsers/links";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const featuredPages = parseFeaturedPages(data);

    const [hoverPage, setHoverPage] = React.useState<
        FeaturedPage | undefined
    >();

    // If the user is hovering on the link to a page, use that page's colors.
    // Otherwise use the index pages' own color palette.
    let colorPalettes = paletteSetOrFallback(hoverPage, indexColorPalettes);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <BodyBackgroundColorTransitionStyle />
            <RecentPagesTitle />
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

const indexColorPalettes = {
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)",
            "hsl(0, 0%, 0%)",
            "hsl(0, 0%, 33%)",
            "hsl(0, 0%, 30%)",
        ]),
    ),
    darkColors: parseColorPalette([
        "hsl(240, 6%, 20%)",
        "hsl(240, 12%, 90%)",
        "hsl(240, 12%, 70%)",
        "hsl(240, 12%, 75%)",
    ]),
};

export const Head: HeadFC<Queries.IndexPageQuery> = ({ data }) => {
    const description = "music •◦◎◉⦿ words | colors / code";
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
 * Fetch all pages tagged "front-page", sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted` (e.g. the "_example" page).
 * - Right now this returns all pages; if this list grows too big then we can
 *   add a limit here.
 *
 * Fetch all page preview images ("preview.png/jpg").
 *
 * - These images will be shown in the `PageItem` component in
 *   `components/PageListing.tsx`, which has a fixed width and height – `13.7ch`
 *   and `9.7ch` respectively. These have an aspect ratio of 1.4, but we set an
 *   aspect ratio of 2 so that the image doesn't ever overflow the height;
 *   visually, this is fine since we also have a transparent opacity gradient
 *   for the image so the top portion will anyways be cutoff.
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
        allMdx(
            filter: {
                frontmatter: {
                    tags: { in: "front-page" }
                    unlisted: { ne: true }
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

interface FeaturedPage {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

const parseFeaturedPages = (data: Queries.IndexPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
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

const SectionTitle = styled.div`
    margin-block-start: 3rem;
    margin-block-end: 3rem;
    margin-inline-start: 1.7rem;
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-color-4);
`;

const RecentPagesTitle: React.FC = () => {
    return (
        <SectionTitle>
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

const AboutSectionTitle_ = styled.div`
    margin-block-start: 3rem;
    margin-block-end: 2rem;
    margin-inline-start: 1.7rem;
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-color-4);
`;

const AboutSectionTitle: React.FC = () => {
    return (
        <AboutSectionTitle_>
            <h2>about</h2>
        </AboutSectionTitle_>
    );
};

const Poem: React.FC = () => {
    return (
        <Poem_>
            <i>murmur</i> to me softly
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
        color: var(--mrmr-color-1);
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
    margin-block-start: 2rem;
    margin-block-end: 2rem;
    margin-inline-start: 1.7rem;
    font-family: serif;
    font-style: italic;

    h2 {
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
        color: var(--mrmr-color-1);
    }
`;
