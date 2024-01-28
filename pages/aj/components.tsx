import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    line-height: 1.4;
`;
