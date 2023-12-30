import { type P5WrapperProps } from "@p5-wrapper/react";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import ReactP5WrapperWithFade from "p5/ReactP5WrapperWithFade";
import * as React from "react";
import styled from "styled-components";

export const Layout: React.FC<React.PropsWithChildren<P5WrapperProps>> = ({
    sketch,
    children,
}) => {
    return (
        <Layout_>
            <FirstFold>
                <Banner />
                <SketchContainer sketch={sketch} />
            </FirstFold>
            {children}
            <Footer />
        </Layout_>
    );
};

const Layout_ = styled.div`
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

const SketchContainer: React.FC<P5WrapperProps> = ({ sketch }) => {
    return (
        <SketchContainer_>
            <ReactP5WrapperWithFade sketch={sketch} />
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

export const Description: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <LinkStyleUnderlined>
            <Description_>{children}</Description_>
        </LinkStyleUnderlined>
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
        <LinkStyleUnderlined>
            <Footer_>
                <p>
                    <Link to="/">mrmr.io</Link>
                </p>
            </Footer_>
        </LinkStyleUnderlined>
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
