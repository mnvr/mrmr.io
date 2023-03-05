import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { removeUndefineds } from "utils/array";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

interface HeadProps {
    title?: string;
    description?: string;
}

export const DefaultHead: React.FC<React.PropsWithChildren<HeadProps>> = ({
    title,
    description,
    children,
}) => {
    const data = useStaticQuery<Queries.HeadQuery>(graphql`
        query Head {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    const site = replaceNullsWithUndefineds(data.site);
    const siteTitle = site?.siteMetadata?.title;
    const pageTitle = removeUndefineds([siteTitle, title]).join(" | ");

    return (
        <>
            <title>{pageTitle}</title>
            {description && <meta name="description" content={description} />}
            <DefaultBody />
            {children}
        </>
    );
};

const DefaultBody = styled.body`
    /* Reset the margin */
    margin: 0;

    /* Set the font */
    font-family: system-ui, sans-serif;

    /*
     * Styling links
     *
     * Anchor tags with an attached href do not inherit color.
     *
     * An anchor can be in the different states, which can be targeted
     * using the following pseudo classes:
     * - a:link    / an anchor tag with a destination
     * - a:visited / exists in the browser history
     * - a:hover
     * - a:focused / using a keyboard, e.g. option + tab on macOS
                     by default, shows a blue box border around the link
     * - a:active  / when the user actually presses the link (red)
     */
    a {
        text-decoration: none;
        border-bottom: 1px solid currentColor;

        // Pages should override this:
        // color:
    }

    a:hover {
        // Pages should override these:
        // color:
        // background-color:
    }

    a:active {
        background-color: yellow;
    }
`;
