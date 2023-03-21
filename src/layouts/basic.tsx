import { Column } from "components/Column";
import { ParsedLinkButtons } from "components/ParsedLinks";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const BasicLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { links, user } = ensure(React.useContext(BuildTimePageContext));
    const userPageLink = {
        slug: user.slug,
        title: `More by @${user.username}`,
    };

    return (
        <Column>
            <ContentContainer>{children}</ContentContainer>
            <PageFooterLinks {...{ links, userPageLink }} />
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
            <ParsedLinkButtons {...props} />
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
