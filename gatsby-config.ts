import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: "mrmr.io",
        siteUrl: "https://mrmr.io",
    },
    graphqlTypegen: true,
    trailingSlash: "never",
    flags: {
        /* Perform (unused) SSR even when doing gatsby develop. This helps catch
           differences earlier without needing to do a separate gatsby build */
        DEV_SSR: true,
    },
    plugins: [
        // CSS-in-JS
        "gatsby-plugin-styled-components",

        // Allow us to use absolute imports for accessing our own components.
        // Requires `baseUrl` to be set in `tsconfig.json`.
        "gatsby-plugin-root-import",

        // Images
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",

        // Write our content in markdown + JSX
        "gatsby-plugin-mdx",
        // Process files in /src/content/, creating a page for each (see
        // `gatsby-node.ts`).
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "content",
                path: "./src/content/",
            },
        },
    ],
};

export default config;
