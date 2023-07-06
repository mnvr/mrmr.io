import Color from "colorjs.io";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import colorNames from "./colors";

export const Content: React.FC = () => {
    const sortedColors = sortByLightness(colorNames);

    return (
        <Grid>
            {sortedColors.map((c) => {
                return (
                    <ColorCell
                        key={c.name}
                        colorName={c.name}
                        isDark={c.lightness < 0.65}
                    >
                        {c.name}
                    </ColorCell>
                );
            })}
        </Grid>
    );
};

/**
 * Sort the given list of color strings by their lightness in the OKLCH space.
 *
 * Return a compound object containing the name, the color object, and its
 * lightness.
 */
const sortByLightness = (css: string[]) => {
    // Keep hold of the names
    const colorAndNames = css.map((cs) => {
        const c = new Color(cs);
        return { color: c, name: cs, lightness: ensure(c.oklch.l) };
    });
    // Sort by the color's lightness (decreasing order)
    colorAndNames.sort((a, b) => b.lightness - a.lightness);
    // Return both the color and the name
    return colorAndNames;
};

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

interface ColorCellProps {
    colorName: string;
    isDark: boolean;
}

const ColorCell = styled.div<ColorCellProps>`
    background-color: ${(props) => props.colorName};
    width: 100px;
    height: 50px;

    font-size: 0.7rem;
    color: ${(props) => (props.isDark ? "white" : "black")};
`;
