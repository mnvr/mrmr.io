import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";
import { Context } from "types";
import { ensure } from "utils/parse";

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

export const createPages: GatsbyNode<any, Context>["createPages"] = async ({
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
                    id
                    fields {
                        slug
                    }
                    internal {
                        contentFilePath
                    }
                }
            }
        }
    `);

    if (errors || !data) {
        reporter.panicOnBuild("Error querying MDX content: ", errors);
        return;
    }

    // As of writing (Gatsby 5.7), we can't seem to be able to use
    // `replaceNullsWithUndefineds` here without freaking Gatsby out.
    const nodes = data.allMdx.nodes;

    const activity = reporter.activityTimer(
        `Creating pages from MDX files [${nodes.length}]`
    );
    activity.start();

    try {
        nodes.forEach((node) => {
            const template = "default";
            const id = node.id;
            const slug = ensure(node.fields?.slug);
            const contentFilePath = ensure(node.internal?.contentFilePath);
            const templatePath = path.resolve(`src/templates/${template}.tsx`);

            createPage<Context>({
                path: slug,
                component: `${templatePath}?__contentFilePath=${contentFilePath}`,
                context: { id },
            });
        });
    } catch (err) {
        activity.panicOnBuild("Error creating pages from MDX content: ", err);
        return;
    }

    activity.end();
};
