import { Column } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { SignoffContents } from "components/Signoff";
import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const TextLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Container>
            <Title />
            {children}
            <Signoff />
            <Footer />
        </Container>
    );
};

export default TextLayout;

/**
 * Container for a width-limited column.
 *
 * - Designed for containing a text post.
 * - Initially designed to work with the "paper" theme.
 *
 * The rest of this file contains other components that work well with this
 * Container. They all are used by the "text" layout, but they're all
 * individually exported from here too in case some page wants to piecemeal use
 * these components without using the whole layout.
 */
export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Column>
            <Content_>{children}</Content_>
        </Column>
    );
};

const Content_ = styled(LinkStyleUnderlined)`
    margin-block: 2rem;
    @media (min-width: 600px) {
        margin-block: 4rem;
    }

    line-height: 1.5;

    blockquote {
        color: var(--mrmr-secondary-color);
        /* Reset the margin. We'll instead use the padding, so that our border
           appears flush to the left, and the padding in between before the
           blockquote's content starts. */
        margin-inline: 0em;
        padding-inline: 1.3em;
    }

    /* Exclude the Quote and AttributedQuote components below from the default
       left border styling */
    blockquote:not(.bq-quote) {
        border-left: 1px solid currentColor;
    }

    ul {
        padding-inline-start: 2rem;
    }

    hr {
        margin-block: 2.6rem;
        width: 50%;
    }

    kbd {
        /* By default, the browsers I've checked in (Safari and Chrome, both on
           macOS) the kbd elements is styled to use the monospace font.

           Here we tweak this a bit */

        font-size: 0.9rem;
        padding-block: 0.1rem;
        padding-inline: 0.3rem;
        border: 1px solid var(--mrmr-secondary-color);
    }

    code {
        background-color: var(--mrmr-code-background-color);
        padding-block: 0.2rem;
    }

    p code {
        padding-inline: 0.4rem;
    }

    pre {
        /* [Note: Styling markdown code blocks]

           These rules are primarily aimed at backtick terminated "code blocks"
           in Markdown, which are rendered to HTML as pre > code. */
        background-color: var(--mrmr-code-background-color);
        /* Since we have a non-white background, use the (stronger) title color
           instead of the text color for increased contrast */
        color: var(--mrmr-title-color);
        padding-block: 1rem;
        /* Just slighly more than margin-inline below */
        padding-inline: 1.1rem;
        /* On small screens, the block's background extends to the edge (beacuse
           of the negative margin we apply before). So don't apply the border
           radius, which looks odd when otherwise the background spans the
           entire width of the screen.
         */
        @media (min-width: 600px) {
            border-radius: 4px;
        }

        /* Since we're tweaking the other margins and paddings, also explicitly
           set the block margin. This is the same as the browser default for
           Chrome (Safari only does 1em margin-top currently) */
        margin-block: 1rem;

        /* Extend outward the same as the inline-padding. This way, the actual
           content of the pre block is left-aligned with the normal text, only
           the background of it extends out and gets a padding from.

           This negative margin should not be more than the padding applied at
           the top level, otherwise this pre block will cause a horizontal
           scroll bar to appear on mobile devices (when the screen width is such
           that the max width of this column is restricted by the screen size).
           */
        margin-inline: -1rem;
    }

    /* [Note: Syntax highlighting in MDX code blocks]
     *
     * We wish to do some minimal syntax highlighting, but handrolled (because
     * (a) integrating existing MDX syntax highlighting plugins is a bit too
     * heavy, and (b) The syntax coloring theme might too a bit too much).
     *
     * As an alternative, we break down the code blocks wherein we want to do
     * syntax highlighting into their pre parent and code children, and
     * individually assign custom classes to the code children to get them to
     * look the way we want.
     *
     * This works great and provides us full control, but it is very cumbersome
     * (not to speak of how it makes the MDX file look ugly). So at some point,
     * we should consider extracting this into some lightweight plugin. */
    code.mrmr-code-comment {
        opacity: 0.7;
    }
`;

/**
 * An adaptive page title component that switches between either:
 *
 * 1. a simple H3 containing the page title,
 *
 * 2. or a larger H2 title accompanied by a smaller subtitle.
 *
 * The second alternative is used if the frontmatter of the page contains a
 * "subtitle" field.
 *
 * This component was originally designed for use at top of the page.
 */
export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, subtitle } = page;

    return subtitle === undefined ? (
        <Title_>{title}</Title_>
    ) : (
        <TitleAndSubtitle_>
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </TitleAndSubtitle_>
    );
};

const Title_ = styled.h3`
    margin-block: 1.8rem;

    font-size: 1.4rem;
    color: var(--mrmr-title-color);
`;

const TitleAndSubtitle_ = styled.div`
    margin-block: 2.7rem;

    h2 {
        margin-block-end: 0;
        font-size: 1.7rem;
        /* For visual alignment (or, alternatively, to keep the wannabe designer
           in me happy[1]), shift the title and subtitle (below) around by a
           pixel but in opposite directions.

           The intent is to get this title + subtitle block to _look_ better
           aligned with the text that follows.

           [1]: Later I found this article that highlights that it's just not me
           hallucinating these issues, but indeed corrected left alignment of
           headlines is a real task typesetters do.
           https://medium.engineering/typography-is-impossible-5872b0c7f891

           That said, I still don't know how to solve this is a manner that
           works on all pages (and perhaps that's the point, it can't be done
           independent of content).
           */
        margin-inline: -1px;
        color: var(--mrmr-title-color);
    }

    p {
        margin-block: 0.3rem;
        margin-inline: 1px;
        font-size: 0.9rem;
        color: var(--mrmr-secondary-color);
    }
`;

/** A H1, but styled like the other titles used by the components in this set */
export const T1 = styled.h1`
    /* Counteract the extra margin we give to the container on larger displays,
       and make this title sit closer to the edge */
    @media (min-width: 600px) {
        margin-block-start: -2rem;
    }

    /* Same color as other titles */
    color: var(--mrmr-title-color);
`;

/**
 * A simple H3 containing the page description.
 *
 * Designed for use at or near the top of the page, in lieu of the page title.
 */
export const DescAsTitle: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { description } = page;

    return <Title_>{description}</Title_>;
};

/**
 * A blockquote suitable for displaying a quotes without inline attribution
 * (e.g. we might've already cited in the surrounding text who said this).
 *
 * Designed for use within the text content of a post.
 *
 * Within the HTML it renders a blockquote with a styling different from the
 * styling that is otherwise applied to blockquotes
 *
 * @see {@link AttributedQuote} for a variation that displays the attribution
 * inline within the blockquote.
 */
export const Quote: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Quote_>{children}</Quote_>;
};

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
        <Quote_>
            <>
                {children}
                <Attribution_>{"– " + attribution}</Attribution_>
            </>
        </Quote_>
    );
};

/**
 * This React component only exists so that we can attach the "bq-quote" class
 * name to a blockquote. Such blockquotes are then excluded from the left border
 * styling that we do globally in {@link Content_} above. */
const BQQuote: React.FC<React.BlockquoteHTMLAttributes<HTMLElement>> = ({
    className,
    children,
}) => {
    return (
        <blockquote className={`bq-quote ${className ?? ""}`}>
            {children}
        </blockquote>
    );
};

const Quote_ = styled(BQQuote)`
    font-family: serif;
    font-style: italic;
`;

const Attribution_ = styled.p`
    font-size: smaller;
    margin-inline-start: 2rem;
`;

/**
 * Author and date in subdued, small text.
 *
 * Designed for use at bottom of the page, after the text content.
 */
export const Signoff: React.FC = () => {
    return (
        <Signoff_>
            <SignoffContents />
        </Signoff_>
    );
};

const Signoff_ = styled.div`
    margin-block-start: 4.5rem;
    line-height: 27px;
    color: var(--mrmr-secondary-color);
`;

/**
 * A minimal Footer containing link all posts and home.
 *
 * Designed for use with a plain text post.
 */
export const Footer: React.FC = () => {
    return (
        <Footer_>
            <LinkContainer>
                <Link to={"/"}>Home</Link>
            </LinkContainer>
        </Footer_>
    );
};

const LinkContainer = styled.div`
    margin-block: 1em;
`;

const Footer_ = styled.footer`
    margin-block-start: 3.9rem;

    font-size: 16px;
    line-height: 27px;

    ul {
        margin: 0;
        /* Extra .2 at the end to account for the line below the links */
        margin-block-end: 1.2em;
        list-style: circle;
        padding-inline-start: 2em;
    }

    li {
        margin-block: 1em;
    }
`;
