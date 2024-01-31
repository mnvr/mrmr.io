import { LinkStyleHover } from "components/LinkStyles";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    /* On big enough screens, give ourselves an additional margin (the code
       layout that we use already provides a basic margin) */
    @media (width > 500px) {
        margin-inline: 1em;
    }

    display: flex;
    flex-direction: column;
    gap: 4em;
`;

export const Section: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Section_>{children}</Section_>;
};

const Section_ = styled.section`
    display: flex;
    flex-wrap: wrap;
`;

export const Box: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Box_>{children}</Box_>;
};

const Box_ = styled.div`
    /* Limit to 100% so that pre blocks start showing a scroll instead of
       making the entire section expand */
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    column-gap: 2em;
    @media (width > 1000px) {
        column-gap: 5em;
    }
    align-items: center;
    margin-block-end: 1em;

    @media (width > 60em) {
        pre {
            margin-inline: 0;
        }
    }
`;

export const Explanation: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <Explanation_>{children}</Explanation_>;
};

const Explanation_ = styled(LinkStyleHover)`
    max-width: 20em;

    ol {
        padding-inline-start: 1em;
    }
`;

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <small>
                <Link to="/">mrmr.io</Link>
            </small>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    margin-block: 1rem;

    a {
        text-decoration: none;
        color: var(--mrmr-secondary-color);
    }

    a:hover {
        color: var(--mrmr-title-color);
    }
`;
