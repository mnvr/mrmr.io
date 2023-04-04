import { graphql, useStaticQuery } from "gatsby";
import { ensure } from "utils/ensure";

/**
 * Return the full URL for a given page by prefixing the given `slug` with the
 * site's URL.
 */
export const fullURLForSlug = (slug: string) => {
    const data = useStaticQuery<Queries.HeadQuery>(graphql`
        query {
            site {
                siteMetadata {
                    siteUrl
                }
            }
        }
    `);

    const siteURL = ensure(data.site?.siteMetadata?.siteUrl);

    if (!slug.startsWith("/"))
        throw new Error(
            `Specify a leading slash when providing the slug (was "${slug}")`
        );

    if (slug.endsWith("/"))
        throw new Error(
            `Do not specify a trailing slash when providing the canonicalPath (was "${slug}")`
        );

    return `${siteURL}${slug}`;
};
