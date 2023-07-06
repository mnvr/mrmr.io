import * as React from "react";
import styled from "styled-components";
import colorNames from "./colors";

export const Content: React.FC = () => {
    return (
        <Grid>
            {colorNames.map((cn) => {
                return (
                    <ColorCell key={cn} colorName={cn}>
                        {cn}
                    </ColorCell>
                );
            })}
        </Grid>
    );
};

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

interface ColorCellProps {
    colorName: string;
}

const ColorCell = styled.div<ColorCellProps>`
    background-color: ${(props) => props.colorName};
    width: 77px;
    height: 77px;

    font-size: 0.7rem;
`;
