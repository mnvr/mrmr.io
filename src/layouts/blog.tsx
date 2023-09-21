import { WideColumn } from "components/Column";
import { Link } from "gatsby";
import * as React from "react";
import { FiList } from "react-icons/fi";
import styled from "styled-components";

export const BlogPostLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <WideColumn>
            <ContentContainer>{children}</ContentContainer>
            <PageFooterLinks />
        </WideColumn>
    );
};

export default BlogPostLayout;

const ContentContainer = styled.div`
    margin-block: 2rem;
`;

const PageFooterLinks: React.FC = () => {
    return (
        <LinkButtonsContainer>
            <hr />
            <ParsedLinkRow>
                <MoreLinkButton />
            </ParsedLinkRow>
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block: 2.25rem;

    hr {
        opacity: 0.075;
        margin-block: 1rem;
    }

    a {
        color: var(--mrmr-color-4);
    }

    a:hover {
        color: var(--mrmr-color-3);
    }
`;

const ParsedLinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
`;

/** A button that shows a link to the home page. */
export const MoreLinkButton: React.FC = () => {
    return (
        <Link to="/">
            <IconContainer>
                <FiList title="More" />
            </IconContainer>
        </Link>
    );
};

const IconContainer = styled.div`
    /** Ensure sufficient tap area for mobile devices */
    min-width: 44px;
    min-height: 44px;

    /* Show the hand icon on hover */
    cursor: pointer;

    /* Set the size of the icon */
    font-size: 1.66rem;
`;
