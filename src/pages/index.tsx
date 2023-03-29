import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, graphql, type HeadFC } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** The home page for mrmr.io */
const IndexPage: React.FC = () => {
    return (
        <Main>
            <PageColorStyle {...colorPalettes} />
            <IndexTitle />
        </Main>
    );
};

const colorPalettes = {
    colors: ensure(
        parseColorPalette([
            "hsl(0, 0%, 100%)",
            "hsl(0, 0%, 0%)",
            "hsl(0, 0%, 33%)",
            "hsl(0, 0%, 20%)",
        ])
    ),
    darkColors: parseColorPalette([
        "hsl(240, 6%, 20%)",
        "hsl(240, 12%, 90%)",
        "hsl(240, 12%, 70%)",
        "hsl(240, 12%, 95%)",
    ]),
};

export default IndexPage;

export const Head: HeadFC<Queries.IndexPageQuery> = ({ data }) => {
    const description = "music •◦◎◉⦿ words | colors / code";
    const canonicalPath = "";

    const file = replaceNullsWithUndefineds(data.file);
    const previewImagePath = file ? getSrc(file) : undefined;

    return (
        <DefaultHead {...{ description, canonicalPath, previewImagePath }} />
    );
};

/**
 * Fetch the data needed by the home page
 *
 * In particular, fetch the preview (meta/og:image) image
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
            <Nav>
                <small>
                    <Link to="/recent">recent</Link>,{" "}
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

const Nav = styled.p`
    padding-block-start: 24svh;
    margin-inline-start: 1.8rem;
    font-family: serif;
    font-style: italic;

    a {
        text-decoration: none;
        opacity: 0.75;
        border-bottom: 1px dashed currentColor;
    }

    a:hover {
        opacity: 1;
        border-bottom: 1px solid currentColor;
        background-color: var(--mrmr-color-1-transparent);
    }
`;
