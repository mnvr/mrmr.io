import { createGlobalStyle } from "styled-components";
import { PageColors } from "utils/page-colors";

export interface GlobalStyleProps {
    backgroundColor: string;
    color: string;
    /** Optional dark mode overrides */
    darkBackgroundColor?: string;
    darkColor?: string;
}

export const DefaultGlobalStyle = createGlobalStyle<GlobalStyleProps>`
    body {
        --mrmr-background-color: ${(props) => props.backgroundColor};
        --mrmr-color: ${(props) => props.color};

        @media (prefers-color-scheme: dark) {
            --mrmr-background-color: ${(props) =>
                props.darkBackgroundColor ?? props.backgroundColor};
            --mrmr-color: ${(props) => props.darkColor ?? props.color};
        }
    }
`;

/**
 * Convenience method to construct an instance of {@link @GlobalStyleProps}
 * from an instance of {@link PageColors}.
 */
export const globalStylePropsFromPageColors = (colors: PageColors) => {
    // Content pages have fixed colors and render the same in both light and
    // dark, so we only specify the light versions (the dark mode will use the
    // same too).
    return {
        backgroundColor: colors.background,
        color: colors.foreground,
    };
};
