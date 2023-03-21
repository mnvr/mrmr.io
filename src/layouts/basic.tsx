import { Column } from "components/Column";
import { ParsedLinkButtons } from "components/ParsedLinks";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const BasicLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const { links } = ensure(React.useContext(BuildTimePageContext));

    return (
        <Column>
            <ContentContainer>{children}</ContentContainer>
            {links && <PageFooterLinks links={links} />}
        </Column>
    );
};

export default BasicLayout;

const ContentContainer = styled.div`
    margin-block: 2rem;
`;

interface PageFooterLinksProps {
    links: ParsedLink[];
}

const PageFooterLinks: React.FC<PageFooterLinksProps> = ({ links }) => {
    return (
        <LinkButtonsContainer>
            <hr />
            <ParsedLinkButtons links={links} />
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
