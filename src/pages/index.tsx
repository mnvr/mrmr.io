import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { PageListing, type Page } from "components/PageListing";
import { graphql, HeadFC, PageProps } from "gatsby";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * The home page for mrmr.io
 *
 * > What it displays is arbitrary. Currently it lists my artwork, but it can
 *   also show nothing. It's like a polythene blowing in the wind, don't rely
 *   on, and you don't know, where it'll go. – @mnvr
 */
const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    // If the user is hovering on the link to a page, use that page's colors.
    let colorPalettes = paletteSetOrFallback(
        [hoverPage?.colors, hoverPage?.darkColors],
        baseColorPalettes
    );

    return (
        <Main>
            <PageColorStyle {...colorPalettes} />
            <GlobalStyle />
            <IndexTitle />
            <PageListing {...{ pages, setHoverPage }} />
        </Main>
    );
};

const baseColorPalettes = {
    colors: ensure(parseColorPalette(["hsl(0, 0%, 100%)", "hsl(0, 0%, 13%)"])),
    darkColors: parseColorPalette(["hsl(240, 6%, 20%)", "hsl(240, 12%, 90%)"]),
};

export default IndexPage;

export const Head: HeadFC = () => <DefaultHead />;

export const query = graphql`
    query IndexPage {
        allMdx(
            filter: {
                fields: { template: { eq: "page" }, username: { eq: "mnvr" } }
            }
            sort: { frontmatter: { date: DESC } }
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
    }
`;

const parsePages = (data: Queries.IndexPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const title = ensure(frontmatter?.title);
        const slug = ensure(fields?.slug);
        const colors = parseColorPalette(frontmatter?.colors);
        const darkColors = parseColorPalette(frontmatter?.dark_colors);

        return { title, slug, colors, darkColors };
    });
};

const GlobalStyle = createGlobalStyle`
    body {
        transition: background-color 200ms ease-out;
    }
`;

const Main = styled.main`
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
`;

const IndexTitle: React.FC = () => {
    return (
        <div>
            <H1>mrmr</H1>
            <Poem />
        </div>
    );
};

const H1 = styled.h1`
    margin-top: 0;
    /* increase top padding when the title and items side by side */
    padding-top: 10svh;
    @media (min-width: 700px) {
        padding-top: 40svh;
    }
    margin-left: 1.8rem;
    margin-bottom: 0;
    opacity: 0.92;
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
            &nbsp;&nbsp;the moon, <i>and</i> the <i>night</i>
        </PoemP>
    );
};

const PoemP = styled.p`
    margin-left: 2rem;
    font-family: serif;
    margin-bottom: 1.9rem;
    opacity: 0.72;
`;
