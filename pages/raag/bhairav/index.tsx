import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <WideColumn>
            <Title>
                <T1>raag</T1> bhairav
            </Title>
            <Raga />
        </WideColumn>
    );
};

const Title = styled.h1`
    font-family: serif;
    font-style: italic;
`;

const T1 = styled.span`
    color: var(--mrmr-color-4);
`;

const Raga: React.FC = () => {
    return (
        <Raga_>
            <RagaNotes />
        </Raga_>
    );
};

const Raga_ = styled.div`
    border: 1px solid tomato;
    min-height: 80svh;
`;

const RagaNotes: React.FC = () => {
    return <RagaNotes_>Test</RagaNotes_>;
};

const RagaNotes_ = styled.div`
    width: min(17rem, 100%);
    background-color: var(--mrmr-color-4);
`;
