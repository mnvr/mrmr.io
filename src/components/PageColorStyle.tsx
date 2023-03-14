import { createGlobalStyle } from "styled-components";
import { PageColors } from "utils/page-colors";

export interface PageColorStyleProps {
    backgroundColor: string;
    color1: string;
    color2: string;
    color3: string;

    /** Optional dark mode overrides */
    darkBackgroundColor?: string;
    darkColor1?: string;
    darkColor2?: string;
    darkColor3?: string;
}

export const PageColorStyle = createGlobalStyle<PageColorStyleProps>`
    body {
        --mrmr-background-color: ${(props) => props.backgroundColor};
        --mrmr-color-1: ${(props) => props.color1};
        --mrmr-color-2: ${(props) => props.color2};
        --mrmr-color-3: ${(props) => props.color3};

        @media (prefers-color-scheme: dark) {
            --mrmr-background-color: ${(props) =>
                props.darkBackgroundColor ?? props.backgroundColor};
            --mrmr-color-1: ${(props) => props.darkColor1 ?? props.color1};
            --mrmr-color-2: ${(props) => props.darkColor2 ?? props.color2};
            --mrmr-color-3: ${(props) => props.darkColor3 ?? props.color3};
        }
    }
`;

/**
 * Convenience method to construct an instance of {@link @PageColorStyleProps}
 * from an instance of {@link PageColors}.
 */
export const createPageColorStyleProps = (colors: PageColors) => {
    // Content pages have fixed colors and render the same in both light and
    // dark, so we only specify the light versions (the dark mode will use the
    // same too).
    return {
        backgroundColor: colors.background,
        color1: colors.color1,
        color2: colors.color2,
        color3: colors.color3,
    };
};
