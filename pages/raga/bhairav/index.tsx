import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <WideColumn>
            <Title>
                <T1>raga</T1> bhairav
            </Title>
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
