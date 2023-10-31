import * as React from "react";
import styled from "styled-components";

/** An width limited column that is positioned slightly towards the left */
export const Column: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Grid>
            <Middle>{children}</Middle>
        </Grid>
    );
};

/** A wider variant of {@link Column} */
export const WideColumn: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <WideGrid>
            <Middle>{children}</Middle>
        </WideGrid>
    );
};

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr min(24rem, 100%) 3fr;
`;

const WideGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr min(31rem, 100%) 5fr;
`;

const Middle = styled.div`
    grid-column: 2/3;
    padding-inline: 1rem;
`;
