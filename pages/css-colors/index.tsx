import Color from "colorjs.io";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import colorNames from "./colors";

export const Content: React.FC = () => {
    const sortedColorInfos = sortByLightness(colorNames);

    return (
        <Grid>
            {sortedColorInfos.map((ci) => {
                return <ColorCell key={ci.name} colorInfo={ci} />;
            })}
        </Grid>
    );
};

interface ColorInfo {
    color: Color;
    name: string;
    lightness: number;
}

/**
 * Sort the given list of color strings by their lightness in the OKLCH space.
 *
 * Return a compound object containing the name, the color object, and its
 * lightness.
 */
const sortByLightness = (css: string[]): ColorInfo[] => {
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
    colorInfo: ColorInfo;
}

const ColorCell: React.FC<ColorCellProps> = ({ colorInfo }) => {
    const { color, name, lightness } = colorInfo;
    const handleClick = (e: any) => {
        console.log(e);
    };

    return (
        <ColorCellDiv
            colorName={name}
            isDark={lightness < 0.65}
            onClick={handleClick}
        >
            {name}
        </ColorCellDiv>
    );
};

interface ColorCellDivProps {
    colorName: string;
    isDark: boolean;
}

const ColorCellDiv = styled.div<ColorCellDivProps>`
    background-color: ${(props) => props.colorName};
    width: 100px;
    height: 50px;

    font-size: 0.7rem;
    color: ${(props) => (props.isDark ? "white" : "black")};
`;
