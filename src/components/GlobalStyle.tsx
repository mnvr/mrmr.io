import { createGlobalStyle } from "styled-components";

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
