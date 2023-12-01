import { ExternalLink } from "components/ExternalLink";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

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

/**
 * A strong element that uses inverted colors to further highlight its content.
 *
 * Lore: The strong element is the semantic counterpart to the bold element, b,
 * and it is used to markup important parts of the content. Similarly, the em
 * (emphasis) element is the semantic counterpart to the italicized element i,
 * and in markup it indicates content that should be emphasized. The visual
 * representantion of strong and emphasis is usually bold and italics, but it's
 * not necessary (as we see here), but there are larger deviations. e.g. screen
 * readers might pronounce them differently.
 */
export const InvertedColorStrong = styled.strong`
    background-color: var(--mrmr-color-1);
    color: var(--mrmr-background-color-1);
    font-weight: normal;
`;

/** A reference link to some external content that opens in an new tab */
export const RefLink: React.FC<
    React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ ...props }) => {
    return (
        <sup>
            <ExternalLink className="mrmr-ref-link" {...props}>
                †
            </ExternalLink>
        </sup>
    );
};

/**
 * Reduce the font size for the entire page.
 *
 * This is a CSS style element that can be included anywhere in the page to
 * reduce the font size globally. It overrides the font size that we made in
 * global.css.
 * */
export const ReducedFontSizeStyle = createGlobalStyle`
    :root {
        font-size: 16px;
    }
`;
