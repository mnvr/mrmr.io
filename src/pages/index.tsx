import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import {
    BodyBackgroundColorTransitionStyle,
    PageListing,
} from "components/PageListing";
import { ParsedLinkButtonsA } from "components/ParsedLinkButtonsA";
import { PageProps, graphql, type HeadFC } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import { parseLinks } from "parsers/links";
import React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    // If the user is hovering on the link to a page, use that page's colors.
    // Otherwise use the index pages' own color palette.
    let colorPalettes = paletteSetOrFallback(hoverPage, indexColorPalettes);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <BodyBackgroundColorTransitionStyle />
            <Title />
            <PageListing {...{ pages, setHoverPage }} />
            <ExternalLinks />
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
        ])
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
 * Fetch all pages, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted` (e.g. the "_example" page).
 * - Right now this returns all pages; if this list grows too big then we add a
 *   limit here too.
 *
 * Fetch all page preview images ("preview.png/jpg").
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
            filter: { frontmatter: { unlisted: { ne: true } } }
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
                    gatsbyImageData
                }
            }
        }
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
    min-height: 75svh;

    /* Increase the size on small (mobile) screens a bit */
    @media (max-width: 600px) {
        font-size: 1.1rem;
    }
`;

const Title: React.FC = () => {
    return (
        <TitleContainer>
            <div>
                <H1>mrmr</H1>
                <Poem />
            </div>
        </TitleContainer>
    );
};

const H1 = styled.h1`
    margin-block: 0;
    margin-inline-start: 1.8rem;
    font-family: serif;
    font-style: italic;
    color: var(--mrmr-color-3);
`;

const Poem: React.FC = () => {
    return (
        <PoemP>
            <i>murmur</i> to me softly
            <br />
            &nbsp;&nbsp;tell me <i>it’s all right</i>
            <br />
            in the <i>wind</i> rustle leaves
            <br />
            &nbsp;&nbsp;the moon, and the <i>night</i>
        </PoemP>
    );
};

const PoemP = styled.p`
    margin-inline-start: 2rem;
    font-family: serif;
    color: var(--mrmr-color-2);
`;

interface Page {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

const parsePages = (data: Queries.IndexPageQuery) => {
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

const ExternalLinks: React.FC = () => {
    const links = parseLinks([
        "https://github.com/mnvr",
        "https://twitter.com/mnvrth",
        "https://instagram.com/manavrt",
        "https://youtube.com/@mnvrth",
    ]);
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtonsA links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block: 6rem;
    margin-inline-start: 1.7rem;

    a {
        color: var(--mrmr-color-4);
    }

    a:hover {
        color: var(--mrmr-color-1);
    }
`;
