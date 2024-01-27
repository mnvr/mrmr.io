import { WideColumn } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { SignoffContents } from "components/Signoff";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import {
    BuildTimePageContext,
    type FrontmatterTag,
    type PageLink,
} from "templates/page";
import { isNote, isPoem } from "utils/attributes";
import { ensure } from "utils/ensure";

/**
 * Container for a width-limited column.
 *
 * - Designed for containing a text post.
 * - Initially designed to work with the "paper" theme.
 *
 * The rest of this file contains other components that work well with this
 * Container. They all are used by the "text" (and "text-hindi") layout, but
 * they're all individually exported from here too in case some page wants to
 * piecemeal use these components without using the whole layout.
 */
export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <WideColumn>
            <Content_>{children}</Content_>
        </WideColumn>
    );
};

const Content_ = styled(LinkStyleUnderlined)`
    margin-block: 2rem;
    @media (min-width: 600px) {
        margin-block: 4rem;
    }

    line-height: 1.5;

    blockquote {
        color: var(--mrmr-color-3);
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

    /* [Note: Code block background colors]

       These colors were picked to work with the "paper" theme, but they also
       work fine with the default theme.

       Currently all "text" layout pages that use code elements use the paper
       theme, so we're hardcoding them in. If they don't work well with other
       themes, we can move these declarations to themes.ts, and allow
       customizing them per theme */
    --mrmr-code-background-color: oklch(97.82% 0.005 247.86);
    @media (prefers-color-scheme: dark) {
        --mrmr-code-background-color: oklch(22.02% 0.016 256.82);
    }

    kbd {
        /* By default, the browsers I've checked in (Safari and Chrome, both on
           macOS) the kbd elements is styled to use the monospace font.

           Here we tweak this a bit */

        font-size: 90%;
        padding-block: 0.1rem;
        padding-inline: 0.3rem;
        border: 1px solid var(--mrmr-color-3);
    }

    code {
        /* The monospace font looks too big sitting next to the other fonts */
        font-size: 90%;

        background-color: var(--mrmr-code-background-color);
        padding-block: 0.2rem;
    }

    p code {
        padding-inline: 0.4rem;
    }

    pre {
        /* Note: [Styling markdown code blocks]
           These rules are primarily aimed at backtick terminated "code blocks"
           in Markdown. */
        background-color: var(--mrmr-code-background-color);
        padding: 1rem;
        /* On small screens, the block's background extends to the edge (beacuse
           of the negative margin we apply before). So don't apply the border
           radius, which looks odd when otherwise the background spans the
           entire width of the screen.
         */
        @media (min-width: 600px) {
            border-radius: 4px;
        }

        /* Extend outward the same as the inline-padding. This way, the actual
           content of the pre block is left-aligned with the normal text, only
           the background of it extends out and gets a padding from.

           This negative margin should not be more than the padding applied at
           the top level, otherwise this pre block will cause a horizontal
           scroll bar to appear on mobile devices (when the screen width is such
           that the max width of this column is restricted by the screen size).
           */
        margin-inline: -1rem;

        /* If the lines in code block do not fit, add a horizontal scroll to the
           pre element instead of increasing the width of the page contents. */
        overflow-x: scroll;
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
    color: var(--mrmr-color-2);
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
        color: var(--mrmr-color-2);
    }

    p {
        margin-block: 0.3rem;
        margin-inline: 1px;
        font-size: 0.9rem;
        color: var(--mrmr-color-3);
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
    color: var(--mrmr-color-2);
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

/**
 * Variant of {@link Signoff} for pages with Hindi content.
 */
export const SignoffHindi: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedSignoffDate } = page;

    return (
        <Signoff_>
            <small>
                मानव राठी
                <br />
                {formattedSignoffDate}
            </small>
        </Signoff_>
    );
};

const Signoff_ = styled.div`
    margin-block-start: 4.5rem;

    line-height: 1.45;
    color: var(--mrmr-color-3);
`;

/**
 * A minimal Footer containing link to related posts, all posts and home.
 *
 * Designed for use with a plain text post.
 */
export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { tags, relatedPageLinks, linkedFromPageLinks } = page;

    return (
        <Footer_>
            {tags.length > 0 && <Tags tags={tags} />}
            {relatedPageLinks.length > 0 && (
                <RelatedPosts links={relatedPageLinks} />
            )}
            {linkedFromPageLinks.length > 0 && (
                <LinkedFromPosts links={linkedFromPageLinks} />
            )}
            {isPoem(page) && (
                <LinkContainer>
                    <Link to={"/poems"}>More poems</Link>
                </LinkContainer>
            )}
            {isNote(page) ? (
                <>
                    <LinkContainer>
                        <Link to={"/notes"}>All notes</Link>
                    </LinkContainer>
                    <LinkContainer>
                        <Link to={"/all"}>All posts</Link>
                    </LinkContainer>
                </>
            ) : (
                <LinkContainer>
                    <Link to={"/all"}>All posts</Link>
                </LinkContainer>
            )}

            <LinkContainer>
                <Link to={"/"}>Home</Link>
            </LinkContainer>
        </Footer_>
    );
};

const LinkContainer = styled.div`
    /** Add a bit of extra margin to account for the underline under links */
    margin-block-end: 10px;
`;

/**
 * A variant of {@link Footer} for pages with Hindi content.
 */
export const FooterHindi: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { relatedPageLinks } = page;

    // Note: this footer is not kept in sync with all the possible content that
    // can be in the default (English) footer. Only what is used in Hindi pages
    // has been added so far.
    return (
        <Footer_>
            {relatedPageLinks.length > 0 && (
                <RelatedPostsHindi links={relatedPageLinks} />
            )}
            {isPoem(page) && (
                <LinkContainer>
                    <Link to={"/poems"}>और कविताएँ</Link>
                </LinkContainer>
            )}
            <LinkContainer>
                <Link to={"/all"}>सारी रचनाएँ</Link>
            </LinkContainer>
            <LinkContainer>
                <Link to={"/"}>प्रारंभ</Link>
            </LinkContainer>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    margin-block-start: 3.9rem;

    font-size: 0.9rem;
    line-height: 2.5;

    ul {
        margin: 0;
        list-style: circle;
        padding-inline-start: 1.8rem;

        /* Similar to the extra margin under LinkContainers, to account for the
           underline underneath links */
        padding-block-end: 5px;
    }

    li {
        padding-inline-start: 2px;
        list-style-position: outside;
    }
`;

interface TagsProps {
    tags: FrontmatterTag[];
}

const Tags: React.FC<TagsProps> = (props) => {
    return (
        <Tags_>
            <TagsTitle>Tags: </TagsTitle>
            <TagsList {...props} />
        </Tags_>
    );
};

const Tags_ = styled.div`
    margin-block-end: 10px;
`;

const TagsTitle = styled.span`
    color: var(--mrmr-color-3);
`;

const TagsList: React.FC<TagsProps> = ({ tags }) => {
    return (
        <span>
            {tags.map((tag, i) => (
                <span key={i}>
                    <TagItem tag={tag} />
                    {i < tags.length - 1 && <TagSeparator />}
                </span>
            ))}
        </span>
    );
};

const TagItem: React.FC<{ tag: FrontmatterTag }> = ({ tag }) => {
    const { label, slug } = tag;
    return slug ? <Link to={slug}>{label}</Link> : <span>{label}</span>;
};

const TagSeparator: React.FC = () => {
    return <TagSeparator_>{", "}</TagSeparator_>;
};

const TagSeparator_ = styled.span`
    color: var(--mrmr-color-3);
`;

interface RelatedPostsProps {
    links: PageLink[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
    return (
        <FooterSection_>
            <FooterListTitle>Related posts</FooterListTitle>
            <RelatedPostsList {...props} />
        </FooterSection_>
    );
};

const FooterSection_ = styled.div`
    /* Similar but not the same as Tags_. There is a visual abstraction that I'm
       missing that would give the footer vertical rhythm, and am just manually
       tottering about for now, adding these paddings here and there. */
    margin-block-end: 7px;
`;

const FooterListTitle = styled.div`
    /* Snuggle just a bit with the list items to provide a sectioning effect */
    color: var(--mrmr-color-3);
`;

const RelatedPostsHindi: React.FC<RelatedPostsProps> = (props) => {
    return (
        <div>
            <FooterListTitle>सम्बन्धित रचनाएँ</FooterListTitle>
            <RelatedPostsList {...props} />
        </div>
    );
};

const RelatedPostsList: React.FC<RelatedPostsProps> = ({ links }) => {
    return (
        <ul>
            {links.map(({ slug, title }) => (
                <li key={slug}>
                    <Link to={slug}>{title}</Link>
                </li>
            ))}
        </ul>
    );
};

const LinkedFromPosts: React.FC<RelatedPostsProps> = (props) => {
    return (
        <FooterSection_>
            <FooterListTitle>Linked from</FooterListTitle>
            <RelatedPostsList {...props} />
        </FooterSection_>
    );
};
