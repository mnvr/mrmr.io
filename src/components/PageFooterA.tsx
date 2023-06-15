import { Link } from "gatsby";
import * as React from "react";
import { RxSlash } from "react-icons/rx";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";
import { Column } from "./Column";

/**
 * A footer for a page template - Variant A.
 *
 * This component is meant to be used within the footer of a page that is being
 * rendered using `template/page.tsx`. In particular, it assumes that a
 * {@link BuildTimePageContext} has been provided - that's where it gets the
 * data that it needs from.
 */
export const PageFooterA: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <Column>
            <PageInfo page={page} />
        </Column>
    );
};

interface PageInfoProps {
    page: Page;
}

const PageInfo: React.FC<PageInfoProps> = ({ page }) => {
    const { formattedDateMY } = page;

    return (
        <PageInfoContents>
            <DetailsContainer>
                Manav Rathi
                <br />
                <small>{formattedDateMY}</small>
            </DetailsContainer>
            <HomeLinkContainer>
                <Link to="/">
                    <RxSlash title="More" />
                </Link>
            </HomeLinkContainer>
        </PageInfoContents>
    );
};

const PageInfoContents = styled.div`
    margin-block-start: 0.6rem;
    margin-block-end: 6rem;
    font-size: 0.9rem;
`;

const DetailsContainer = styled.div`
    margin-inline: 0.3rem;
    opacity: 0.5;

    margin-block-end: 2rem;
`;

const HomeLinkContainer = styled.div`
    margin-inline: 0.07rem;

    a {
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        opacity: 1;
    }
`;
