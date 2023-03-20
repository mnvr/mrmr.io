import React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { Column } from "./Column";
import { ParsedLinkButtons } from "./ParsedLinks";

interface PageFooterLinksProps {
    /**
     * Opacity of the icons in their resting state
     *
     * @default 0.7
     *
     * The icons start off transparent; on hover they become opaque.
     */
    iconOpacity?: number;
}

/**
 * A column showing links for a page.
 *
 * This component is meant to be used within the footer of a page that is being
 * rendered using `template/page.tsx`. In particular, it assumes that a
 * {@link BuildTimePageContext} has been provided - that's where it gets the
 * list of links from.
 */
export const PageFooterLinks: React.FC<PageFooterLinksProps> = ({
    iconOpacity,
}) => {
    const { links } = ensure(React.useContext(BuildTimePageContext));

    return links ? (
        <Column>
            <LinkButtonsContainer>
                <ParsedLinkButtons {...{ links, iconOpacity }} />
            </LinkButtonsContainer>
        </Column>
    ) : (
        <></>
    );
};

const LinkButtonsContainer = styled.div`
    margin-block: 2.25rem;
`;
