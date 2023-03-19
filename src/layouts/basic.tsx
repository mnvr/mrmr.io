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
    hr {
        opacity: 0.075;
        margin-block: 1rem;

        /* hr elements have margin-inline set to auto, which causes them to be
           centered. We want this one to be left-aligned, so set the leading
           margin to 0 (whilst reducing the width) */
        margin-inline-start: 0;
        width: 50%;
    }
`;
