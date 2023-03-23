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

        // Process files in /users/, creating a page for each (see
        // `gatsby-node.ts`).
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "users",
                path: "./users/",
            },
        },
    ],
};

export default config;
