import { WideColumn } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, PageLink } from "templates/page";
import { ensure } from "utils/ensure";

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
        <WideColumn>
            <Content_>{children}</Content_>
        </WideColumn>
    );
};

const Content_ = styled.div`
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
`;

/**
 * A simple H3 containing the page title.
 *
 * Designed for use at top of the page.
 */
export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title } = page;

    return <Title_>{title}</Title_>;
};

const Title_ = styled.h3`
    @media (min-width: 600px) {
        margin-block-end: 1.8rem;
    }

    line-height: 1.5rem;
    color: var(--mrmr-color-2);
`;

/**
 * Author and date in subdued, small text.
 *
 * Designed for use at bottom of the page, after the text content.
 */
export const Signoff: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <Signoff_>
            <small>
                Manav Rathi
                <br />
                {formattedDateMY}
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
    const { relatedPageLinks } = page;

    return (
        <Footer_>
            <LinkStyleUnderlined>
                {relatedPageLinks.length > 0 && (
                    <RelatedPosts links={relatedPageLinks} />
                )}
                <Link to={"/all"}>All posts</Link>
                <br />
                <Link to={"/"}>Home</Link>
            </LinkStyleUnderlined>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    /* For a perfect vertical cadence, this should be 2 rem. However, the
       line-height for text in the footer is not 1 rem but is instead 2.4 rem,
       and the text is positioned in the center of that 2.2 rem block. So we
       need to subtract from the desired margin to visually make the distance
       between the text <--> signoff and signoff <--> footer look rhythmic. */
    margin-block-start: 2.4rem;

    font-size: 0.9rem;
    line-height: 2.2rem;

    ul {
        margin: 0;
        list-style: circle;
        padding-inline-start: 1.6rem;
    }
`;

interface RelatedPostsProps {
    links: PageLink[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ links }) => {
    return (
        <div>
            <div>Related posts</div>
            <ul>
                {links.map(({ slug, title }) => (
                    <li key={slug}>
                        <Link to={slug}>{title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
