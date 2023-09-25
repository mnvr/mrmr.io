import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";

// Need to use the full path here to, using absolute paths with automatic "src"
// prefixing doesn't work in gatsby-node.ts.
import { PageTemplateContext } from "types/gatsby";
import { ensure } from "./src/utils/ensure";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    node,
    getNode,
    actions,
}) => {
    const { createNodeField } = actions;

    // Create and attach a "slug" field to all MDX nodes.
    if (node.internal.type == "Mdx") {
        // Do not add a trailing slash to the generated paths.
        // This matches the `trailingSlash` option in `gatsby-config.ts`.
        const trailingSlash = false;
        const slug = createFilePath({ node, getNode, trailingSlash });

        const newFields = { slug };

        Object.entries(newFields).forEach(([name, value]) => {
            createNodeField({
                node,
                name,
                value,
            });
        });
    }
};

export const createPages: GatsbyNode<
    any,
    PageTemplateContext
>["createPages"] = async ({ graphql, reporter, actions }) => {
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
                    frontmatter {
                        layout
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
        `Creating pages from MDX files [${nodes.length}]`,
    );
    activity.start();

    try {
        nodes.forEach((node) => {
            const id = node.id;
            const slug = ensure(node.fields?.slug);
            const contentFilePath = ensure(node.internal?.contentFilePath);

            const templatePath = path.resolve("src/templates/page.tsx");

            const context = {
                pageID: id,
                relativeDirectory: relativeDirectory(slug),
            };

            createPage<PageTemplateContext>({
                path: slug,
                component: `${templatePath}?__contentFilePath=${contentFilePath}`,
                context: context,
            });
        });
    } catch (err) {
        const e = err instanceof Error ? err : Error(`${err}`);
        activity.panicOnBuild("Error creating pages from MDX content: ", e);
        return;
    }

    activity.end();
};

// Remove the leading slash from the slug to obtain the relative path
const relativeDirectory = (slug: string) => slug.substring(1);
