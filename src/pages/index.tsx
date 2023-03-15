import { DefaultHead } from "components/Head";
import {
    createPageColorStyleProps,
    PageColorStyle,
} from "components/PageColorStyle";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import { PageColors, parsePageColors } from "parsers/page-colors";
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
    const baseColors = {
        backgroundColor: "hsl(0, 0%, 100%)",
        color1: "hsl(0, 0%, 13%)",
        color2: "hsl(0, 0%, 13%)",
        color3: "hsl(0, 0%, 13%)",
        darkBackgroundColor: "hsl(240, 6%, 20%)",
        darkColor1: "hsl(240, 12%, 90%)",
        darkColor2: "hsl(240, 12%, 90%)",
        darkColor3: "hsl(240, 12%, 90%)",
    };

    const pages = parsePages(data);

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    // If the user is hovering on the link to a page, use that page's colors.
    let csProps = createPageColorStyleProps(hoverPage?.colors, baseColors);

    return (
        <Main>
            <PageColorStyle {...csProps} />
            <GlobalStyle />
            <IndexTitle />
            <PageListing {...{ pages, setHoverPage }} />
        </Main>
    );
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
                }
                fields {
                    slug
                }
            }
        }
    }
`;

interface Page {
    title: string;
    slug: string;
    colors?: PageColors;
}

const parsePages = (data: Queries.IndexPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const title = ensure(frontmatter?.title);
        const slug = ensure(fields?.slug);
        const colors = parsePageColors(frontmatter?.colors);

        return { title, slug, colors };
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

interface PageListingProps {
    pages: Page[];
    setHoverPage: (page: Page | undefined) => void;
}

const PageListing: React.FC<PageListingProps> = ({ pages, setHoverPage }) => {
    const n = pages.length;
    return (
        <PageGrid>
            {pages.map((page, i) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <PageItem {...page}>
                        <PageItemP>{page.title.toLowerCase()}</PageItemP>
                        <PageItemCount>{n - i}</PageItemCount>
                    </PageItem>
                </Link>
            ))}
        </PageGrid>
    );
};

const PageGrid = styled.div`
    display: grid;
    /* 2 columns on large enough screens */
    grid-template-columns: auto;
    @media (min-width: 460px) {
        grid-template-columns: auto auto;
    }
    align-content: end;
    gap: 1.9rem;

    font-weight: 500;
    font-variant: small-caps;
    padding: 1.9rem;

    a {
        text-decoration: none;
    }
`;

const PageItem = styled.div<Page>`
    background-color: ${(props) => props.colors?.background ?? "inherit"};
    color: ${(props) => props.colors?.color1 ?? "inherit"};
    width: 13ch;
    height: 11.7ch;
    padding: 0.33rem 0.66rem;
    position: relative;
`;

const PageItemP = styled.p`
    margin: 0.25rem 0;
    /* Setting the width to 1rem causes each word to be on its own line */
    width: 1rem;
`;

const PageItemCount = styled.div`
    position: absolute;
    bottom: 0.59rem;
    right: 0.66rem;
    font-size: 80%;
    font-style: italic;
    opacity: 0.8;
`;
