import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { HeadFC, Link } from "gatsby";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";

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
    colors: ensure(parseColorPalette(["hsl(0, 0%, 100%)", "hsl(0, 0%, 13%)"])),
    darkColors: parseColorPalette(["hsl(240, 6%, 20%)", "hsl(240, 12%, 90%)"]),
};

export default IndexPage;

export const Head: HeadFC = () => <DefaultHead />;

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
