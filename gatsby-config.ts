import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: "mrmr.io",
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

        // Process files in /users/, creating a page for each (see
        // `gatsby-node.ts`).
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "users",
                path: "./users/",
            },
        },

        // Pick up images etc from src/assets so that the gatsby image plugins
        // can transform these into `ImageSharp` sharp nodes.
        //
        // User content stores assets in their own per-page directories; these
        // are already picked up by the "users" case above. The `src/assets`
        // folder contains assets that are needed by various top-level pages
        // that are not specific to a user.
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "assets",
                path: "./src/assets/",
            },
        },
    ],
};

export default config;
