import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import "styles/global.css";
import { isDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { fullURLForSlug } from "utils/url";

interface HeadProps {
    /**
     * Title of the page
     *
     * Alternatively, @see {@link titlePrefix} to use the default site title but
     * with an additional prefix.
     *
     * If neither of them are specified, then the default site title is used.
     */
    title?: string;

    /**
     * A prefix that is prepended to the default site title (separated by "•") to
     * generate the title of the page.
     *
     * @see {@link title} for providing a full string instead.
     */
    titlePrefix?: string;

    /**
     * Page description (optional)
     *
     * It is useful to let search engines know what this page it about. It is
     * also used as the subtitle by various apps / sites to generate the preview
     * "card" when a link to this page is shared.
     *
     * If a description is not provided, then the site's own description
     * (specified in the `siteMetadata` field in `gatsby-config.ts`) will be
     * used as the fallback.
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

    /**
     * The relative public path ("src") for the preview image for this page.
     *
     * If specified, this is set as the "og:image" meta property, and will be
     * used by various social media and messaging apps to render a preview of
     * the page.
     */
    previewImagePath?: string;
}

export const DefaultHead: React.FC<React.PropsWithChildren<HeadProps>> = ({
    title,
    titlePrefix,
    description,
    canonicalPath,
    previewImagePath,
    children,
}) => {
    const data = useStaticQuery<Queries.HeadQuery>(graphql`
        query Head {
            site {
                siteMetadata {
                    title
                    description
                    siteUrl
                }
            }
        }
    `);

    const site = replaceNullsWithUndefineds(data.site);
    const siteURL = ensure(site?.siteMetadata?.siteUrl);

    const siteTitle = site?.siteMetadata?.title;
    const siteDescription = site?.siteMetadata?.description;

    const pageTitle =
        title ?? [titlePrefix, siteTitle].filter(isDefined).join(" · ");
    const pageDescription = description ?? siteDescription;

    let canonicalURL: string | undefined;
    if (canonicalPath === "") {
        // Home page passes the empty string as the path
        canonicalURL = siteURL;
    } else if (canonicalPath) {
        canonicalURL = fullURLForSlug(canonicalPath);
    }

    // The path to the og:image needs to be an absolute URL, not a relative
    // path. This means that the path will be incorrect when running on
    // localhost, but I haven't found a use case for preview images on localhost
    // yet, so that might be fine.

    let previewImageURL = previewImagePath
        ? fullURLForSlug(previewImagePath)
        : undefined;

    // A lot of this is duplicated - e.g. there's already a meta/description,
    // and I'm not sure why the og folks created their duplicate standard. I
    // tried omitting a few of these, but then I couldn't get Twitter to render
    // a preview (and I didn't want to add yet another layer of duplication by
    // adding the various twitter:* tags).
    //
    // From the Twitter docs:
    //
    // > If an og:type, og:title and og:description exist in the markup but
    //   twitter:card is absent, then a summary card may be rendered.
    //
    // So the platter of tags below is an attempt to make them (and other
    // messaging apps etc) happy.

    return (
        <>
            {/* Keep the preview image URL first - apparently some sites give
                up looking for it if they can't find it in the first few bytes
                of the page */}
            {previewImageURL && (
                <meta name="og:image" content={previewImageURL} />
            )}
            <title>{pageTitle}</title>
            <meta name="og:title" content={pageTitle} />
            <meta name="og:type" content="website" />
            {pageDescription && (
                <>
                    <meta name="description" content={pageDescription} />
                    <meta name="og:description" content={pageDescription} />
                </>
            )}
            {canonicalURL && <link rel="canonical" href={canonicalURL} />}
            {children}
        </>
    );
};
