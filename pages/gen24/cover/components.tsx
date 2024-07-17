import { type P5WrapperProps } from "@p5-wrapper/react";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import { Signoff } from "layouts/text";
import * as React from "react";
import styled from "styled-components";
import { zeroPad2 } from "utils/string";
import { Banner, Description, FirstFold, SketchContainer } from "../components";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Layout_>
            {children}
            <SignoffContainer>
                <Signoff />
            </SignoffContainer>
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

type DemoProps = P5WrapperProps & {
    n?: number;
};

export const Demo: React.FC<React.PropsWithChildren<DemoProps>> = ({
    n,
    sketch,
    children,
}) => {
    return (
        <Demo_>
            <FirstFold>
                <Title n={n} />
                <SketchContainer sketch={sketch} />
            </FirstFold>
            <Description>{children}</Description>
        </Demo_>
    );
};

const Demo_ = styled.div`
    margin-block-end: 5rem;
`;

const Title: React.FC<{ n?: number }> = ({ n }) => (
    <Banner
        left="GRD 24"
        right={n === undefined ? "COVER" : `DEX ${zeroPad2(n)}`}
    />
);

const SignoffContainer = styled.div`
    margin-block-start: -5rem;
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }
`;

const Footer: React.FC = () => {
    return (
        <LinkStyleUnderlined>
            <Footer_>
                <p>
                    <Link to="/gen24">Genuary 24</Link>
                </p>
                <p>
                    <Link to="/">Home</Link>
                </p>
            </Footer_>
        </LinkStyleUnderlined>
    );
};

const Footer_ = styled.div`
    margin-block: 4rem;
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }

    p {
        font-size: 0.9rem;
        line-height: 1.5rem;
    }
`;
