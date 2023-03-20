import { Column } from "components/Column";
import { ParsedLinkButtons } from "components/ParsedLinks";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import styled from "styled-components";
import {
    BuildTimePageContext,
    LevelContext,
    LevelContext2,
} from "templates/page";

export const BasicLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const page = React.useContext(BuildTimePageContext);
    const level = React.useContext(LevelContext);
    const level2 = React.useContext(LevelContext2);
    const links = page?.links;
    console.log("rendering layout");
    console.log({ page, level, level2 });

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
`;
