import * as React from "react";
import styled from "styled-components";

/**
 * Container for the "code" layout
 *
 * - Designed for containing arbitrary content but having some blocks of code.
 *
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
    @media (max-width: 500px) {
        margin-inline: 0.8rem;
    }

    pre {
        /* See: [Note: Styling markdown code blocks] */
        background-color: var(--mrmr-code-background-color);
        color: var(--mrmr-title-color);
        padding-block: 1rem;
        padding-inline: 1.1rem;
        margin-inline: -1rem;
    }

    @media (max-width: 500px) {
        /* Make code blocks smaller on small screens to avoid overflow */
        pre code {
            font-size: 13px;
        }

        pre {
            padding-inline: 1.1rem;
        }
    }
`;
