import type { GatsbyConfig } from "gatsby";

// These need to be a relative paths (similar to how we need to use relative
// paths in `gatsby-node.ts`).
import { replaceNullsWithUndefineds } from "./src/utils/replace-nulls";
import * as E from "utils/ensure";
import { assert } from "utils/assert";

const config: GatsbyConfig = {
    siteMetadata: {
        title: "mrmr.io",
        description: "Words, music and art by Manav",
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

        // Load data from YAML files in `src/data` into GraphQL.
        //
        // This does the step 1, of sourcing those files. For step 2, we install
        // the gatsby-transformer-yaml plugin and enable it below.
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "data",
                path: "./src/data/",
            },
        },

        // Convert YAML file nodes into GraphQL nodes.
        //
        // The contents of top level arrays, say 'foo', defined a .yaml file
        // located in `src/data` will be available in GraphQL as `dataYaml.foo`.
        "gatsby-transformer-yaml",

        // Generate an RSS feed (mirroring /all) at /rss.xml
        //
        // Note that this file is only generated when running in production mode
        // (`yarn build`).
        {
            resolve: "gatsby-plugin-feed",
            options: {
                feeds: [
                    {
                        output: "/rss.xml",
                        title: "All posts on mrmr.io",
                        // Same query as the AllPage query used by /all
                        query: `
                            query AllPageFeed {
                                allMdx(
                                    filter: { fields: { feed: { eq: "/all" } } }
                                    sort: [
                                        { frontmatter: { date: DESC } }
                                        { frontmatter: { title: ASC } }
                                    ]
                                ) {
                                    nodes {
                                        frontmatter {
                                            title
                                            description
                                            formattedDateMY: date(formatString: "MMM YYYY")
                                            attributes
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
): Record<string, string>[] => {
    const query = E.ensureObject(query_);
    assert("site" in query);

    const s = query["site"];
    const nodes = replaceNullsWithUndefineds(nodes_);

    return nodes.map((node) => {
        return {
            test: "test",
        };
        // const { frontmatter, fields } = node;
        // const slug = ensure(fields?.slug);

        // const title = ensure(frontmatter?.title);
        // const description = frontmatter?.description;
        // const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        // // const attributes = filterDefined(frontmatter?.attributes);

        // return { slug, title, description, formattedDateMY };
    });
};

export default config;
