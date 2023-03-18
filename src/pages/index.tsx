import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { graphql, HeadFC, Link, PageProps } from "gatsby";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * The home page for mrmr.io
 *
 * > What it displays is arbitrary. It could list my artwork, but it can also
 *   show nothing. It's like a torn bag of polythene, blowing in the wind; you
 *   don't / won't know where it'll go so it is best not to rely on it. – @mnvr
 */
const IndexPage: React.FC<PageProps<Queries.IndexPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <Main>
            <PageColorStyle {...colorPalettes} />
            <IndexTitle />
        </Main>
    );
};

const colorPalettes = {
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
            <Nav>
                <small>
                    <Link to="/some">some</Link>,{" "}
                    <Link to="/random">random</Link>
                </small>
            </Nav>
        </div>
    );
};

const H1 = styled.h1`
    margin-block: 0;
    padding-block-start: 37svh;
    margin-inline-start: 1.8rem;
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
    margin-inline-start: 2rem;
    font-family: serif;
    opacity: 0.72;
`;

const Nav = styled.p`
    padding-block-start: 24svh;
    margin-inline-start: 1.8rem;
    opacity: 0.72;
    font-family: serif;
    font-style: italic;

    a {
        text-decoration: none;
        border-bottom: 1px dashed currentColor;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        background-color: var(--mrmr-color-1-transparent);
    }
`;
