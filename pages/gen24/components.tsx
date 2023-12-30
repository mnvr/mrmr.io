import { type P5WrapperProps } from "@p5-wrapper/react";
import { ExternalLinkWithIcon } from "components/ExternalLink";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import ReactP5WrapperWithFade from "p5/ReactP5WrapperWithFade";
import * as React from "react";
import styled from "styled-components";

interface DayProps {
    day?: number;
}

type LayoutProps = DayProps & P5WrapperProps;

export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
    day,
    sketch,
    children,
}) => {
    return (
        <Layout_>
            <FirstFold>
                <Banner day={day} />
                <SketchContainer sketch={sketch} />
            </FirstFold>
            <Description>{children}</Description>
            <Footer day={day} />
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

const Banner: React.FC<DayProps> = ({ day }) => {
    return (
        <Banner_>
            <BannerH>GEN 24</BannerH>
            <BannerH>
                {day !== undefined ? `DAY ${pad2(day)}` : "BEGIN"}
            </BannerH>
        </Banner_>
    );
};

const pad2 = (day: number) => (day < 10 ? `0${day}` : `${day}`);

const Banner_ = styled.div`
    height: 67px;

    display: flex;
    justify-content: space-between;
`;

const BannerH = styled.h3`
    @media (max-width: 900px) {
        margin-inline: 1rem;
    }
    color: var(--mrmr-color-3);
    font-weight: 300;
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

const Description: React.FC<React.PropsWithChildren> = ({ children }) => {
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

const Footer: React.FC<DayProps> = ({ day }) => {
    return (
        <LinkStyleUnderlined>
            <Footer_>
                {day !== undefined && (
                    <p>
                        <Link to="/gen24">All days</Link>
                    </p>
                )}
                <p>
                    <Link to="/">Home</Link>
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
        font-size: 0.9rem;
        line-height: 1.5rem;
    }
`;

/**
 * This is as alias for {@link ExternalLinkWithIcon}, just reexported with a
 * shorter name for convenience and avoiding requiring another import in the MDX
 * file.
 */
export const ELink = ExternalLinkWithIcon;
