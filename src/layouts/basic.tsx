import { Column } from "components/Column";
import {
    ParsedLinkButtonsA,
    type ParsedLinkButtonsProps,
} from "components/ParsedLinkButtonsA";
import * as React from "react";
import styled from "styled-components";

export const BasicLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const moreLink = {
        slug: "/",
        title: "More",
    };

    return (
        <Column>
            <ContentContainer>{children}</ContentContainer>
            <PageFooterLinks moreLink={moreLink} />
        </Column>
    );
};

export default BasicLayout;

const ContentContainer = styled.div`
    margin-block: 2rem;
`;

const PageFooterLinks: React.FC<ParsedLinkButtonsProps> = (props) => {
    return (
        <LinkButtonsContainer>
            <hr />
            <ParsedLinkButtonsA {...props} />
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
