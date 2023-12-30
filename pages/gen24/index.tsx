import { type Sketch } from "@p5-wrapper/react";
import { ExternalLinkWithIcon } from "components/ExternalLink";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import ReactP5WrapperWithFade from "p5/ReactP5WrapperWithFade";
import * as React from "react";
import styled from "styled-components";
import { sketch } from "./sketch";

export const Content: React.FC = () => {
    return (
        <Content_>
            <FirstFold>
                <Banner />
                <SketchContainer />
            </FirstFold>
            <RestOfTheContent />
        </Content_>
    );
};

const Content_ = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 900px;
    margin: auto;
`;

const FirstFold = styled.div`
    min-height: 98svh;

    display: flex;
    flex-direction: column;
`;

const Banner: React.FC = () => {
    return (
        <Banner_>
            <BannerH />
        </Banner_>
    );
};

const Banner_ = styled.div`
    height: 67px;
`;

const SketchContainer: React.FC = () => {
    return (
        <SketchContainer_>
            <Sketch />
        </SketchContainer_>
    );
};

const SketchContainer_ = styled.div`
    flex-grow: 1;

    display: flex;
    justify-content: center; /* horizontally */
    align-items: center; /* vertically */
`;

const BannerH: React.FC = () => {
    return <BannerH_>GEN 24</BannerH_>;
};

const BannerH_ = styled.h3`
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }
    color: var(--mrmr-color-3);
    font-weight: 300;
`;

const Sketch: React.FC = () => {
    return <ReactP5WrapperWithFade sketch={sketch} />;
};

const RestOfTheContent: React.FC = () => {
    return (
        <LinkStyleUnderlined>
            <Description />
            <Footer />
        </LinkStyleUnderlined>
    );
};

const Description: React.FC = () => {
    return (
        <Description_>
            <p>
                Genuary is an month-long online art fair (that's one way of
                putting it!) that happens every year, in, you guessed it,
                January. This year I thought I'll do remixes of the other
                Genuary art that I come across and find particularly inspiring.
            </p>
            <p>
                Additionally, I've constrained myself to use only grids. So this
                is like a Griduary too.
            </p>
            <p>
                I'm using p5.js to make these sketches, and the{" "}
                <ExternalLinkWithIcon href="https://github.com/mnvr/mrmr.io/tree/main/pages/gen24">
                    source code for all of these is available on GitHub
                </ExternalLinkWithIcon>
                . The one you see above is not a remix, it is a cover I made to
                kickstart things off.{" "}
                {/*The remixes are below. Tap on any of them
                to view a live version.*/}
            </p>
            <p>Have a great and inspiring 2024.</p>
        </Description_>
    );
};

const Description_ = styled.div`
    margin-block: 1rem;
    @media (min-width: 800px) {
        margin-block: 2rem;
    }
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }

    max-width: 30rem;

    p {
        line-height: 1.5rem;
    }

    a {
        font-weight: normal;
    }
`;

const Footer: React.FC = () => {
    return (
        <Footer_>
            <p>
                <Link to="/">mrmr.io</Link>
            </p>
        </Footer_>
    );
};

const Footer_ = styled.div`
    margin-block: 3rem;
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }

    p {
        line-height: 1.5rem;
    }
`;
