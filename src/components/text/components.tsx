import { WideColumn } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { SignoffContents } from "components/Signoff";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, PageLink } from "templates/page";
import { isPoem } from "utils/attributes";
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

    p {
        line-height: 1.3rem;
    }

    blockquote {
        font-family: serif;
        font-style: italic;
        color: var(--mrmr-color-3);
        margin-inline-start: 1rem;
    }

    blockquote p {
        line-height: 1.2rem;
    }

    hr {
        margin-block: 2.6rem;
        width: 50%;
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
    margin-block-end: 1.8rem;

    line-height: 1.5rem;
    color: var(--mrmr-color-2);
`;

const TitleAndSubtitle_ = styled.div`
    margin-block-end: 3rem;

    h2 {
        margin-block-end: 0;
        color: var(--mrmr-color-2);
    }

    p {
        margin-block-start: 0.3rem;
        line-height: 1.5rem;
        color: var(--mrmr-color-3);
    }
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
    margin-block-start: 2rem;

    line-height: 1.1rem;
    color: var(--mrmr-color-3);
`;

/**
 * A minimal Footer containing link to related posts, all posts and home.
 *
 * Designed for use with a plain text post.
 */
export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { tags, relatedPageLinks } = page;

    return (
        <Footer_>
            {tags.length > 0 && <Tags tags={tags} />}
            {relatedPageLinks.length > 0 && (
                <RelatedPosts links={relatedPageLinks} />
            )}
            {isPoem(page) && (
                <>
                    <Link to={"/poems"}>More poems</Link>
                    <br />
                </>
            )}
            <Link to={"/all"}>All posts</Link>
            <br />
            <Link to={"/"}>Home</Link>
        </Footer_>
    );
};

/**
 * A variant of {@link Footer} for pages with Hindi content.
 */
export const FooterHindi: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { relatedPageLinks } = page;

    return (
        <Footer_>
            {relatedPageLinks.length > 0 && (
                <RelatedPostsHindi links={relatedPageLinks} />
            )}
            {isPoem(page) && (
                <>
                    <Link to={"/poems"}>और कविताएँ</Link>
                    <br />
                </>
            )}
            <Link to={"/all"}>सारी रचनाएँ</Link>
            <br />
            <Link to={"/"}>प्रारंभ</Link>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    /* For a perfect vertical cadence, this should be 2 rem. However, the
       line-height for text in the footer is not 1 rem but is instead 2.4 rem,
       and the text is positioned in the center of that 2.2 rem block. So we
       need to subtract from the desired margin to visually make the distance
       between the text <--> signoff and signoff <--> footer look rhythmic. */
    margin-block-start: 2.9rem;

    font-size: 0.9rem;
    line-height: 2.2rem;

    ul {
        margin: 0;
        /* Add an itsy bitsy extra padding at the bottom to make the list items
         * fit better in the context of the links that follow */
        padding-block-end: 0.16rem;
        list-style: circle;
        padding-inline-start: 1.6rem;
    }
`;

interface TagsProps {
    tags: string[];
}

const Tags: React.FC<TagsProps> = (props) => {
    return (
        <Tags_>
            <RPTitle>Tagged: </RPTitle>
            <TagsList {...props} />
        </Tags_>
    );
};

const Tags_ = styled.div`
    margin-block-end: 2px;
`;

const TagsList: React.FC<TagsProps> = ({ tags }) => {
    return (
        <span>
            {tags.map((tag, i) => (
                <span key={tag}>
                    {tag}
                    {i < tags.length - 1 && <TagSeparator />}
                </span>
            ))}
        </span>
    );
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
        <div>
            <RPTitle>Related posts</RPTitle>
            <RelatedPostsList {...props} />
        </div>
    );
};

const RPTitle = styled.span`
    color: var(--mrmr-color-3);
`;

const RelatedPostsHindi: React.FC<RelatedPostsProps> = (props) => {
    return (
        <div>
            <RPTitle>सम्बन्धित रचनाएँ</RPTitle>
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
