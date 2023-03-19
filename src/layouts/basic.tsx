import { Column } from "components/Column";
import { ParsedLinkButtons } from "components/ParsedLinks";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import { Page } from "templates/page";

interface BasicLayoutProps {
    page: Page;
}

export const BasicLayout: React.FC<
    React.PropsWithChildren<BasicLayoutProps>
> = ({ page, children }) => {
    const { links } = page;
    return (
        <Column>
            {children}
            {links && <PageFooterLinks links={links} />}
        </Column>
    );
};

export default BasicLayout;

interface PageFooterLinksProps {
    links: ParsedLink[];
}

const PageFooterLinks: React.FC<PageFooterLinksProps> = ({ links }) => {
    return (
        <LinkButtonsContainer>
            <ParsedLinkButtons links={links} />
        </LinkButtonsContainer>
    );
};

const LinkButtonsContainer = styled.div`
    a {
        opacity: 0.7;
    }

    a:hover {
        opacity: 1;
    }
`;
