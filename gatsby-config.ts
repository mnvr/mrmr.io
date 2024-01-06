import type { GatsbyConfig } from "gatsby";

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
    ],
};

export default config;
