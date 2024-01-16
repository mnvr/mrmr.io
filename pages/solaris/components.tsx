import * as React from "react";
import styled from "styled-components";

export const Indented = styled.div`
    p {
        margin-block-start: 0;
        margin-inline-start: 1rem;
    }
`;

export const Indent: React.FC = () => {
    return <Indent2> </Indent2>;
};

export const Indent2 = styled.span`
    padding-inline: 0.7rem;
`;
