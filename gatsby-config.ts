import type { GatsbyConfig } from "gatsby";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`).
import { assert } from "./src/utils/assert";
import * as E from "./src/utils/ensure";

const config: GatsbyConfig = {
    siteMetadata: {
        title: "mrmr.io",
        description: "Manav's blog",
        siteUrl: "https://mrmr.io",
    },
    graphqlTypegen: true,
    trailingSlash: "never",
    plugins: [
        // CSS-in-JS
        "gatsby-plugin-styled-components",

        // Allow us to use absolute imports for accessing our own components.
        // Requires `baseUrl` to be set in `tsconfig.json`.
        "gatsby-plugin-root-import",

        // Use the Gatsby Link component for relative links in MDX
        "gatsby-plugin-catch-links",

        // Images
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",

        // Generate favicons etc.
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                icon: "static/icon.png",
            },
        },

        // Write our pages in markdown + JSX
        "gatsby-plugin-mdx",

        // The `gatsby-source-filesystem` plugin creates `File` nodes from
        // files. Subsequently, various "transformer" plugins can `File` nodes
        // into other, more specific, types of nodes (e.g. `JSON`).

        // Process files in /pages/, creating a page for each (see
        // `gatsby-node.ts`).
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: "./pages/",
            },
        },

        // Pick up images etc from src/assets so that the gatsby image plugins
        // can transform these into `ImageSharp` sharp nodes.
        //
        // The assets stored in the per-page directories are already picked up
        // by the "pages" case above. The `src/assets` folder contains assets
        // that are needed by other non-content top-level pages.
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "assets",
                path: "./src/assets/",
            },
        },

        // Generate an RSS feed (mirroring /all) at /rss.xml
        //
        // Note that this file is only generated when running in production mode
        // (i.e. when doing `yarn build`).
        {
            resolve: "gatsby-plugin-feed",
            options: {
                feeds: [
                    {
                        output: "/rss.xml",
                        title: "All posts on mrmr.io",
                        // Same query as the AllPage query used by /all, except
                        // the date format string is empty to get moment.js to
                        // emit RFC 2822 dates.
                        //
                        // The RSS spec requires a RFC 822 date. RFC 2822
                        // supercedes RFC 822.
                        query: `
                            query AllPageFeed {
                                allMdx(
                                    filter: { frontmatter: { unlisted: { ne: true } } }
                                    sort: [
                                        { frontmatter: { date: DESC } }
                                        { frontmatter: { title: ASC } }
                                    ]
                                ) {
                                    nodes {
                                        frontmatter {
                                            title
                                            description
                                            date(formatString: "")
                                        }
                                        fields {
                                            slug
                                        }
                                    }
                                }
                            }
                        `,
                        serialize: ({ query }: { query: unknown }) =>
                            serializeFeedQuery(query),
                    },
                ],
            },
        },
    ],
};

/**
 * Construct RSS itemOptions [1] from the site metadata and the
 * {@link PageListingPageData} fragments produced by the "AllPageFeed" GraphQL
 * query.
 *
 * We pass this as the serialize argument to the "gatsby-plugin-feed". The
 * plugin will call it when it is constructing the RSS feed for our site, and
 * it'll pass it an query object with the following shape
 *
 *     query: { site: { siteMetadata: [Object] }, allMdx: { nodes: [Array] } }
 *
 * Unfortunately, I haven't found a way to get the GraphQL TypeScript typegen to
 * work in this context, so this code does a bit of manual parsing.
 *
 * [1]: https://www.npmjs.com/package/rss#itemoptions
 */
export const serializeFeedQuery = (
    query_: unknown,
): Record<string, unknown>[] => {
    const query = E.ensureObject(query_);

    // This is silly, but oh well, I don't yet know how to abstract this. Of
    // course, I could stop caring about the types and use an any to force the
    // compiler's hand (esp since only runs at build time), but hey, where's the
    // fun in that.

    assert("site" in query);
    const site = E.ensureObject(query.site);

    assert("siteMetadata" in site);
    const siteMetadata = E.ensureObject(site.siteMetadata);

    assert("siteUrl" in siteMetadata);
    const siteURL = E.ensureString(siteMetadata.siteUrl);

    assert("allMdx" in query);
    const allMdx = E.ensureObject(query.allMdx);

    assert("nodes" in allMdx);
    const nodes = E.ensureArray(allMdx.nodes);

    return nodes.map((node_) => {
        const node = E.ensureObject(node_);

        assert("frontmatter" in node);
        const frontmatter = E.ensureObject(node.frontmatter);

        assert("title" in frontmatter);
        const title = E.ensureString(frontmatter.title);

        assert("description" in frontmatter);
        const description =
            typeof frontmatter.description === "string"
                ? frontmatter.description
                : undefined;

        assert("date" in frontmatter);
        const date = E.ensureString(frontmatter.date);

        assert("fields" in node);
        const fields = E.ensureObject(node.fields);

        assert("slug" in fields);
        const slug = E.ensureString(fields.slug);

        const url = `${siteURL}${slug}`;

        return { title, description, url, date };
    });
};

export default config;
