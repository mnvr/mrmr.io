import { createGlobalStyle } from "styled-components";

interface GlobalStyleProps {
    backgroundColor: string;
    color: string;
    /** Optional dark mode overrides */
    darkBackgroundColor?: string;
    darkColor?: string;
}

export const DefaultGlobalStyle = createGlobalStyle<GlobalStyleProps>`
    body {
        background-color: ${(props) => props.backgroundColor};
        color: ${(props) => props.color};

        @media (prefers-color-scheme: dark) {
            background-color: ${(props) =>
                props.darkBackgroundColor ?? props.backgroundColor};
            color: ${(props) => props.darkColor ?? props.color};
        }
    }
`;
