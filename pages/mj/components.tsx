import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    margin: 1em;
`;

export const Section: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Section_>{children}</Section_>;
};

const Section_ = styled.section`
    border: 1px solid tomato;
    display: flex;
    flex-wrap: wrap;
`;

export const Box: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Box_>{children}</Box_>;
};

const Box_ = styled.section`
    border: 1px solid tomato;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    line-height: 1.3em;

    align-items: center;

    pre {
        border: 1px solid green;
        width: 4em;
        overflow-x: scroll;

        margin-inline: 1em;
    }

    pre code {
        /* The monospace font looks too big sitting next to the other fonts */
        font-size: 90%;
    }
`;

export const Explanation: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <Explanation_>{children}</Explanation_>;
};

const Explanation_ = styled.div`
    border: 1px solid tomato;
    max-width: 20em;
`;

export const Code: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Code_>{children}</Code_>;
};

const Code_ = styled.div`
    width: 10em;
    border: 1px solid tomato;
`;

export const Sound1: React.FC = () => {
    return <Button_>Play</Button_>;
};

const Button_ = styled.button`
    margin: 1em;
`;
