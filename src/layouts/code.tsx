import React from "react";
import styled from "styled-components";

/**
 * An almost unstyled page layout with minimal CSS styling for code blocks.
 */
export const CodeLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Content_>{children}</Content_>;
};

export default CodeLayout;

const Content_ = styled.div`
    margin: 1rem;

    pre {
        /* See: [Note: Styling markdown code blocks] */
        background-color: var(--mrmr-code-background-color);
        color: var(--mrmr-title-color);
        padding-block: 1rem;
        padding-inline: 1.1rem;
        margin-block: 1rem;
        margin-inline: -1rem;
    }

    @media (width < 500px) {
        margin-inline: 0.8rem;
        pre {
            /* inverse of the above margin to ensure end-to-end code blocks */
            margin-inline: -0.8rem;
        }

        /* Make code blocks smaller on small screens to avoid overflow */
        pre code {
            font-size: 13px;
        }
    }
`;
