import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const Column: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Grid>
            <Left />
            <Middle>{children}</Middle>
            <Right />
        </Grid>
    );
};

const Grid = styled.div`
    display: grid;
    background-color: teal;
    grid-template-columns: 1fr min(24rem, 100%) 4fr;
`;

const Left = styled.div``;
const Right = styled.div``;

const Middle = styled.div`
    background-color: rebeccapurple;
`;

export default Column;
