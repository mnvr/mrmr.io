import { PageColors } from "parsers/page-colors";
import { createGlobalStyle } from "styled-components";

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
 *
 * @param pageColors The colors to use. These are usually specified in the
 * frontmatter of MDX files.
 * @param fallbackProps If specified, these fallback set of colors will be
 * returned as the props when `pageColors` are not specified.
 *
 * If neither `pageColors` nor `fallbackProps` are specified, then this function
 * returns {@link DefaultPageColorStyleProps}.
 */
export const createPageColorStyleProps = (
    pageColors?: PageColors,
    fallbackProps?: PageColorStyleProps
) => {
    if (!pageColors) return fallbackProps ?? DefaultPageColorStyleProps;

    // Content pages have fixed colors and render the same in both light and
    // dark, so we only specify the light versions (the dark mode will use the
    // same too).
    return {
        backgroundColor: pageColors.background,
        color1: pageColors.color1,
        color2: pageColors.color2,
        color3: pageColors.color3,
    };
};

/**
 * These are the default set of colors returned by
 * {@link createPageColorStyleProps} if neither the colors nor the fallbackProps
 * were provided to it.
 */
export const DefaultPageColorStyleProps: PageColorStyleProps = {
    backgroundColor: "hsl(0, 0%, 100%)",
    color1: "hsl(0, 0%, 15%)",
    color2: "hsl(0, 0%, 15%)",
    color3: "hsl(0, 0%, 13%)",
    darkBackgroundColor: "hsl(198, 13%, 8%)",
    darkColor1: "hsl(0, 0%, 87%)",
    darkColor2: "hsl(0, 0%, 87%)",
    darkColor3: "hsl(0, 0%, 87%)",
};
