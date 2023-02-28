import React, { PropsWithChildren } from "react";
import styled from "styled-components";

const Column: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Grid>
            <div />
            <Middle>{children}</Middle>
            <div />
        </Grid>
    );
};

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr min(24rem, 100%) 3fr;
`;

const Middle = styled.div`
    padding: 0 1rem;
`;

export default Column;
