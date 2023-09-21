import { Column } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const BlogPostLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <Column>
            <ContentContainer>{children}</ContentContainer>
        </Column>
    );
};

export default BlogPostLayout;

const ContentContainer = styled.div`
    margin-block: 2rem;

    hr {
        opacity: 0.075;
        @media (prefers-color-scheme: dark) {
            opacity: 0.15;
        }
        margin-block-start: 2rem;
    }
`;
