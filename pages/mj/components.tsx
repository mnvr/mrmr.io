import { LinkStyleHover } from "components/LinkStyles";
import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    /* On big enough screens, give ourselves an additional margin (the code
       layout that we use already provides a basic margin) */
    @media (min-width: 500px) {
        margin: 1em;
    }

    display: flex;
    flex-direction: column;
    gap: 4em;

    margin-block-end: 6em;
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

const Box_ = styled.section`
    /* Limit to 100% so that pre blocks start showing a scroll instead of
       making the entire section expand */
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    column-gap: 2em;
    @media (min-width: 1000px) {
        column-gap: 5em;
    }
    align-items: center;
    margin-block-end: 1em;

    pre {
        margin-inline: 0;
    }

    @media (max-width: 500px) {
        pre {
            margin-inline: -1rem;
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
