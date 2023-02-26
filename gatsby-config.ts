import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `mrmr`,
        siteUrl: `https://mrmr.io`,
    },
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-styled-components",
        "gatsby-plugin-root-import",
        "gatsby-plugin-image",
        "gatsby-plugin-sitemap",
        "gatsby-plugin-mdx",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: "./src/images/",
            },
        },
    ],
};

export default config;
