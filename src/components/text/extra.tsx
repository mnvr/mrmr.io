import * as React from "react";
import styled from "styled-components";

interface AttributedQuoteProps {
    attribution: string;
}
/**
 * A blockquote suitable for displaying attributed quotes.
 *
 * Designed for use within the text content of a post.
 */
export const AttributedQuote: React.FC<
    React.PropsWithChildren<AttributedQuoteProps>
> = ({ attribution, children }) => {
    return (
        <AttributedQuote_>
            <>
                {children}
                <Attribution_>{"– " + attribution}</Attribution_>
            </>
        </AttributedQuote_>
    );
};

const AttributedQuote_ = styled.blockquote`
    p {
        margin-block-end: 0.9rem;
    }
`;

const Attribution_ = styled.small`
    margin-inline-start: 2rem;
`;
