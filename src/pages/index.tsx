import { GlobalStyleProps, DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ensure, parseDefaultTemplateColors } from "utils/parse";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const defaultColors: GlobalStyleProps = {
        backgroundColor: "hsl(0, 0%, 100%)",
        color: "hsl(0, 0%, 13%)",
        darkBackgroundColor: "hsl(240, 6%, 20%)",
        darkColor: "hsl(240, 12%, 90%)",
    };

    const pages = parsePages(data);

    const [hoverPage, setHoverPage] = React.useState<Page | undefined>();

    return (
        <Main>
            <DefaultGlobalStyle {...(hoverPage ?? defaultColors)} />
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
        allMdx(sort: { frontmatter: { date: DESC } }) {
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
    backgroundColor: string;
    color: string;
}

const parsePages = (data: Queries.IndexPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const title = ensure(frontmatter?.title);
        const slug = ensure(fields?.slug);
        const { backgroundColor, color } = parseDefaultTemplateColors(
            frontmatter?.colors
        );

        return { title, slug, backgroundColor, color };
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
    filter: opacity(0.92);
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
    filter: opacity(0.72);
`;

interface PageListingProps {
    pages: Page[];
    setHoverPage: (page: Page | undefined) => void;
}

const PageListing: React.FC<PageListingProps> = ({ pages, setHoverPage }) => {
    return (
        <PageGrid>
            {pages.map((page) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <PageItem {...page}>
                        <PageItemP>{page.title.toLowerCase()}</PageItemP>
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
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};
    width: 13ch;
    height: 11.7ch;
    padding: 0.33rem 0.66rem;
`;

const PageItemP = styled.p`
    margin: 0.25rem 0;
    /* Setting the width to 1rem causes each word to be on its own line */
    width: 1rem;
`;
