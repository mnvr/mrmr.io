import { DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { ensure, parseDefaultTemplateColors } from "utils/parse";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const defaultColors = {
        backgroundColor: "hsl(0, 0%, 100%)",
        color: "hsl(0, 0%, 13%)",
        darkBackgroundColor: "hsl(240, 6%, 20%)",
        darkColor: "hsl(240, 12%, 90%)",
    };

    const pages = parsePages(data);

    return (
        <Main>
            <DefaultGlobalStyle {...defaultColors} />
            <IndexTitle />
            <PageListing pages={pages} />
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

const PageListing: React.FC<{ pages: Page[] }> = ({ pages }) => {
    return (
        <ItemsUL>
            {pages.map(({ title, slug, backgroundColor, color }) => (
                <ItemLI key={slug} color={backgroundColor}>
                    {title}
                </ItemLI>
            ))}
        </ItemsUL>
    );
};

const ItemsUL = styled.ul`
    padding: 4rem;

    list-style: none;
    font-family: system-ui, sans-serif;
    font-weight: 500;
`;

const ItemLI = styled.li`
    background-color: ${(props) => props.color};
    color: white;
    padding: 0.2rem 0.4rem;
`;
