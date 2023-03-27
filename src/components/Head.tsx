import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import "styles/global.css";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

interface HeadProps {
    /**
     * Page specific title (optional)
     *
     * It is appended to the site title (separated by "|").
     */
    title?: string;

    /**
     * Page description (optional)
     *
     * It is useful to let search engines know what this page it about. It is
     * also used as the subtitle by various apps / sites to generate the preview
     * "card" when a link to this page is shared.
     */
    description?: string;

    /**
     * Canonical slug of the page (optional)
     *
     * If specified, this slug is suffixed to the `siteUrl` specified in
     * `gatsby-config.ts` to construct the canonical URL.
     *
     * - The slug should begin with a slash but should not end with a slash
     *   (this matches the `trailingSlash` option in `gatsby-config.ts`).
     *
     * - The slug for the home page should be the empty string.
     *
     * ### About Canonical URLs
     *
     * If there are multiple copies of the same page – say the site is available
     * via multiple domains, or if the same page is available in the site
     * structure under various URL hierarchies, or if the same page is indexed
     * with different URL parameters, this canonical URL tells search engines
     * (and other automated systems) which of these is the "source of truth". In
     * particular, without this, search engines might downgrade the rating of
     * all the copies, considering them as keyword spam.
     *
     * In our cases, we don't really need these currently (the first 2 cases
     * don't apply), but it doesn't hurt either apparently. MAGNI, maybe we're
     * gonna need it.
     */
    canonicalPath?: string;
}

export const DefaultHead: React.FC<React.PropsWithChildren<HeadProps>> = ({
    title,
    description,
    canonicalPath,
    children,
}) => {
    const data = useStaticQuery<Queries.HeadQuery>(graphql`
        query Head {
            site {
                siteMetadata {
                    title
                    siteUrl
                }
            }
        }
    `);

    const site = replaceNullsWithUndefineds(data.site);

    const siteTitle = site?.siteMetadata?.title;
    const pageTitle = [siteTitle, title].filter(isDefined).join(" | ");

    let canonicalURL: string | undefined;
    if (canonicalPath === "") {
        // Home page passes the empty string as the path
        canonicalURL = ensure(site?.siteMetadata?.siteUrl);
    } else if (canonicalPath) {
        if (!canonicalPath.startsWith("/"))
            throw new Error(
                `Specify a leading slash when providing the canonicalPath (was "${canonicalPath}")`
            );

        if (canonicalPath.endsWith("/"))
            throw new Error(
                `Do not specify a trailing slash when providing the canonicalPath (was "${canonicalPath}")`
            );

        const baseURL = ensure(site?.siteMetadata?.siteUrl);
        canonicalURL = `${baseURL}${canonicalPath}`;
    }

    return (
        <>
            <title>{pageTitle}</title>
            {description && <meta name="description" content={description} />}
            {canonicalURL && <link rel="canonical" href={canonicalURL} />}
            {children}
        </>
    );
};
