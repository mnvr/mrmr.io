import { WideColumn } from "components/Column";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

/**
 * Container for a width-limited column.
 *
 * - Designed for containing a text post.
 * - Initially designed to work with the "paper" theme.
 */
export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <WideColumn>
            <ContentContainer>{children}</ContentContainer>
        </WideColumn>
    );
};

const ContentContainer = styled.div`
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
    margin-block: 2rem;

    line-height: 1.1rem;
    color: var(--mrmr-color-3);
`;

/**
 * A minimal Footer containing link to related posts, all posts and home.
 *
 * Designed for use with a plain text post.
 */
export const Footer: React.FC = () => {
    return (
        <Footer_>
            <Link to={"/all"}>All posts</Link>
            <br />
            <Link to={"/"}>Home</Link>
        </Footer_>
    );
};

const Footer_ = styled.div`
    margin-block: 2rem;
    @media (min-width: 600px) {
        margin-block: 4rem;
    }

    font-size: 0.8rem;
    line-height: 2rem;

    a {
        text-decoration: none;
        font-weight: 500;
        color: var(--mrmr-color-1);
    }

    a:hover {
        color: var(--mrmr-color-2);
    }
`;
