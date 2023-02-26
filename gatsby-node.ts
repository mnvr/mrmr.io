import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    node,
    getNode,
    actions,
}) => {
    const { createNodeField } = actions;

    // Create and attach a "slug" field to all MDX nodes
    if (node.internal.type == "Mdx") {
        // Do not add a trailing slash to the generated paths.
        // This matches the `trailingSlash` option in `gatsby-config.ts`.
        const trailingSlash = false;
        const slug = createFilePath({ node, getNode, trailingSlash });

        createNodeField({
            node,
            name: "slug",
            value: slug,
        });
    }
};

export const createPages: GatsbyNode["createPages"] = async ({
    graphql,
    reporter,
    actions,
}) => {
    const { createPage } = actions;

    // Create a page for each MDX node
    const { data, errors } = await graphql<Queries.ContentPagesQuery>(`
        query ContentPages {
            allMdx {
                nodes {
                    frontmatter {
                        title
                        key
                    }
                    fields {
                        slug
                    }
                    body
                }
            }
        }
    `);

    if (errors || !data) {
        reporter.panicOnBuild("Error querying MDX content: ", errors);
        return;
    }

    const nodes = data.allMdx.nodes;

    const activity = reporter.activityTimer(
        `Creating pages from ${nodes.length} MDX files`
    );
    activity.start();

    try {
        nodes.forEach((node) => {
            const template = 'default';

            const slug = node.fields?.slug;
            if (!slug) {
                throw new Error(`Missing field "slug" in MDX node`);
            }

            createPage({
                path: slug,
                component: path.resolve(`src/templates/${template}.tsx`),
                context: {
                    ...node.frontmatter,
                    ...node.fields,
                    body: node.body,
                },
            });
        });
    } catch (err) {
        activity.panicOnBuild("Error creating pages from MDX content: ", err);
        return;
    }

    activity.end();
};
