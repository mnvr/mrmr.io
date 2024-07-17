import { ExternalLink } from "components/ExternalLink";
import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { Link, graphql, type HeadFC, type PageProps } from "gatsby";
import {
    GatsbyImage,
    getImage,
    getSrc,
    type ImageDataLike,
} from "gatsby-plugin-image";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import React, { useState } from "react";
import { BsArrowRightShort, BsMastodon } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import styled, { createGlobalStyle } from "styled-components";
import { frontPageTheme } from "themes/themes";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const Page: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const recentPages = parseRecentPages(data);
    const featuredPages = parseFeaturedPages(data);

    const [hoverPage, setHoverPage] = useState<FeaturedPage | undefined>();

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
            limit: 7
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

/** A CSS transition that makes the background color changes more pleasing */
const BodyBackgroundColorTransitionStyle = createGlobalStyle`
    body {
        transition: background-color 200ms ease-out;
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
        <SectionTitle $marginBlockEnd="2.4rem">
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

/** The data for each page required by the {@link FeaturedPageListing} component */
interface FeaturedPage {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    previewImage?: ImageDataLike;
}

interface FeaturedPageListingProps {
    /** The ordered list of pages to show */
    pages: FeaturedPage[];
    /** A function that is called when the user hovers over a link to a page */
    setHoverPage: (page: FeaturedPage | undefined) => void;
}

const FeaturedPageListing: React.FC<FeaturedPageListingProps> = ({
    pages,
    setHoverPage,
}) => {
    const n = pages.length;
    return (
        <FPageGrid>
            {pages.map((page, i) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <FPageItem
                        $backgroundColor={page.colors?.background}
                        $color={page.colors?.text}
                    >
                        <FBackgroundImage page={page} />
                        <FPageItemContent>
                            <FPageItemP>{page.title.toLowerCase()}</FPageItemP>
                            <FPageItemCount>{n - i}</FPageItemCount>
                        </FPageItemContent>
                    </FPageItem>
                </Link>
            ))}
        </FPageGrid>
    );
};

const FPageGrid = styled.div`
    padding-inline: 2px;

    display: flex;
    flex-wrap: wrap;
    /* Instead of this gap (that mirrors the padding-inline above), we rely on
       the transparent / hover border below */
    /* gap: 2px; */

    font-weight: 500;
    font-variant: small-caps;

    a {
        text-decoration: none;
        /* Keep a transparent border of the same thickness as the border that
           would be used in the hover state. This avoids a layout shift on
           hover. */
        border: 1px solid transparent;
    }

    a:hover {
        border: 1px solid var(--mrmr-tertiary-color);
    }
`;

interface FPageItemProps {
    $backgroundColor?: string;
    $color?: string;
}

const FPageItem = styled.div<FPageItemProps>`
    background-color: ${(props) => props.$backgroundColor ?? "inherit"};
    color: ${(props) => props.$color ?? "inherit"};
    width: 13.7ch;
    height: 9.7ch;

    display: grid;
`;

const FBackgroundImage: React.FC<{ page: FeaturedPage }> = ({ page }) => {
    return <FBackgroundImageM previewImage={page.previewImage} />;
};

interface FBackgroundImageMProps {
    previewImage?: ImageDataLike;
}

const FBackgroundImageM = React.memo(
    ({ previewImage }: FBackgroundImageMProps) => {
        const image = previewImage ? getImage(previewImage) : undefined;

        // Use an empty alt since this is a decorative background image
        return (
            <FBackgroundImageContainer>
                {image && <GatsbyImage image={image} alt="" />}
            </FBackgroundImageContainer>
        );
    },
    (prevProps, props) => Object.is(imgSrc(prevProps), imgSrc(props)),
);

const imgSrc = ({ previewImage }: FBackgroundImageMProps) =>
    previewImage ? getSrc(previewImage) : undefined;

const FBackgroundImageContainer = styled.div`
    grid-area: 1 / 1;

    /* Same size as parent */
    width: 13.7ch;
    height: 9.7ch;

    /* Chrome 119 on macOS (and possibly others) still require the -webkit
       vendor prefix for both mask-image and linear-gradient */
    -webkit-mask-image: -webkit-linear-gradient(
        transparent,
        rgba(0, 0, 0, 0.3)
    );
    mask-image: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
`;

const FPageItemContent = styled.div`
    padding-block: 0.2rem;
    padding-inline: 0.66rem;

    grid-area: 1 / 1;
    z-index: 1;

    position: relative;
`;

const FPageItemP = styled.p`
    margin: 0.25rem 0;
    /* Set the width to the width of the smallest word. This causes each word to
       be on its own line */
    width: min-content;
`;

const FPageItemCount = styled.div`
    position: absolute;
    bottom: 0.59rem;
    right: 0.66rem;
    font-size: 80%;
    font-style: italic;
    opacity: 0.8;
`;

const Poem: React.FC = () => {
    return (
        <Poem_>
            <i>
                <b>mrmr</b>
            </i>{" "}
            to me softly
            <br />
            &nbsp;&nbsp;they tell me <i>it’s all right</i>
            <br />
            in the wind rustle leaves
            <br />
            &nbsp;&nbsp;the moon, and the <i>night</i>
        </Poem_>
    );
};

const Poem_ = styled.p`
    margin-inline-start: 2rem;
    font-family: serif;
    line-height: 1.4;
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
    @media (max-width: 500px) {
        margin-inline: 1rem;
    }

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
