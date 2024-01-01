import { type P5WrapperProps } from "@p5-wrapper/react";
import { ExternalLinkWithIcon } from "components/ExternalLink";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import { useIsDarkMode } from "hooks/use-is-dark-mode";
import ReactP5WrapperWithFade from "p5/ReactP5WrapperWithFade";
import * as React from "react";
import styled from "styled-components";
import { zeroPad2 } from "utils/string";

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
                <Title day={day} />
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

export const FirstFold = styled.div`
    min-height: 98svh;

    display: flex;
    flex-direction: column;
`;

const Title: React.FC<DayProps> = ({ day }) => (
    <Banner
        left="GEN 24"
        right={day !== undefined ? `DAY ${zeroPad2(day)}` : "BEGIN"}
    />
);

export interface BannerProps {
    left: string;
    right: string;
}

export const Banner: React.FC<BannerProps> = ({ left, right }) => {
    return (
        <Banner_>
            <BannerH>{left}</BannerH>
            <BannerH>{right}</BannerH>
        </Banner_>
    );
};

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

export const SketchContainer: React.FC<P5WrapperProps> = ({ sketch }) => {
    const isDarkMode = useIsDarkMode();
    return (
        <SketchContainer_>
            <ReactP5WrapperWithFade {...{ sketch, isDarkMode }} />
        </SketchContainer_>
    );
};

const SketchContainer_ = styled.div`
    flex-grow: 1;

    display: flex;
    justify-content: center; /* horizontally */
    align-items: center; /* vertically */
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

    code {
        /* The monospace font looks too big sitting next to the other fonts */
        font-size: 90%;
        @media (max-width: 450px) {
            font-size: 78%;
        }
    }

    pre {
        color: var(--mrmr-color-3);
        /* See: Note: [Styling markdown code blocks] */
        padding: 0.5rem;
        border-radius: 5px;
        background-color: oklch(90% 0 0 / 0.1);
        overflow-x: scroll;
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
