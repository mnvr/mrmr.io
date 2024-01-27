import * as React from "react";
import styled from "styled-components";

/**
 * Container for the "code" layout
 *
 * - Designed for containing arbitrary content but having some blocks of code.
 * - Initially designed to work with the default theme, should also work with
 *   the "paper" theme.
 *
 * The rest of this file contains other components that work well with this
 * Container. They all are used by the "code" layout, but they're all also
 * individually exported from here too in case some page wants to piecemeal use
 * these components without using the whole layout.
 */
export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Content_>{children}</Content_>;
};

const Content_ = styled.div`
    margin: 1rem;

    /* 1.5 (used by the text layout) might be a bit too much styling, but the
       browser default (~1.2) feels too squished. Give these pages a bit extra,
       they can override this in their CSS if needed */
    line-height: 1.3;

    /* See [Note: Code block background colors] */
    --mrmr-code-background-color: oklch(97.82% 0.005 247.86);
    @media (prefers-color-scheme: dark) {
        --mrmr-code-background-color: oklch(22.02% 0.016 256.82);
    }

    code {
        /* The monospace font looks too big sitting next to the other fonts */
        font-size: 16px;
    }

    pre {
        /* See [Note: Styling markdown code blocks] */
        background-color: var(--mrmr-code-background-color);
        overflow-x: scroll;
        padding-inline: 1rem;
        padding-block: 1em;
        margin-inline: -1rem;
    }
`;
