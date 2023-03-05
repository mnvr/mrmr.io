import { GlobalStyleProps, DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
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

const Main = styled.main`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

const IndexTitle: React.FC = () => {
    return (
        <div>
            <H1>mrmr</H1>
            <PoemP>
                <PoemText />
            </PoemP>
        </div>
    );
};

const H1 = styled.h1`
    margin-top: 0;
    padding-top: 40svh;
    font-size: 4rem;
    margin-left: 1.8rem;
    margin-bottom: 0;
    filter: opacity(0.92);
`;

const PoemP = styled.p`
    margin-left: 2rem;
    font-family: serif;
`;

const PoemText: React.FC = () => {
    return (
        <>
            <i>murmur</i> to me softly
            <br />
            &nbsp;&nbsp;tell me it is <i>all right</i>
            <br />
            in the <i>wind</i> rustle leaves
            <br />
            &nbsp;&nbsp;the moon, and the <i>night</i>
        </>
    );
};

interface PageListingProps {
    pages: Page[];
    setHoverPage: (page: Page | undefined) => void;
}

const PageListing: React.FC<PageListingProps> = ({ pages, setHoverPage }) => {
    return (
        <PageGrid>
            {[...pages, ...pages].map((page) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <PageItem {...page}>{page.title.toLowerCase()}</PageItem>
                </Link>
            ))}
        </PageGrid>
    );
};

const PageGrid = styled.div`
    display: grid;
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
    width: 11ch;
    min-height: 8ch;
    padding: 0.33rem 0.66rem;
`;
