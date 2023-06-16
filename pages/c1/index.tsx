import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Grid>
            <SketchContainer />
        </Grid>
    );
};

const Grid = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
`;

const SketchContainer = styled.div`
    width: 400px;
    height: 400px;
    background-color: antiquewhite;
`;
