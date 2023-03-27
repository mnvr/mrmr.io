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
    canonicalSlug?: string;
}

export const DefaultHead: React.FC<React.PropsWithChildren<HeadProps>> = ({
    title,
    description,
    canonicalSlug,
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
    if (canonicalSlug !== undefined) {
        if (canonicalSlug.endsWith("/")) {
            throw new Error(
                `Do not specify a trailing slash when providing the canonicalSlug (was "${canonicalSlug}")`
            );
        }

        const baseURL = ensure(site?.siteMetadata?.siteUrl);
        canonicalURL =
            canonicalSlug === "" ? baseURL : `${baseURL}/${canonicalSlug}`;
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
