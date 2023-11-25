import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";

// Need to use the full path here to, using absolute paths with automatic "src"
// prefixing doesn't work in gatsby-node.ts.
import { PageTemplateContext } from "types/gatsby";
import { ensure, ensureString } from "./src/utils/ensure";

export const createResolvers: GatsbyNode["createResolvers"] = ({
    createResolvers,
}) => {
    createResolvers({
        Mdx: {
            author: {
                type: ["String!"],
                resolve: (source, args, context, info) => {
                    console.log(source, args, context, info);
                    return ["Manav"];
                },
            },
        },
    });
};

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

        if (slug === "/evoke") {
            createNodeField({
                node,
                name: "previewImage",
                value: "../../src/assets/default/preview.png",
            });
        }
    }
};

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
    reporter,
    getNodesByType,
}) => {
    // Create source nodes for all MDX nodes which don't have an associated
    // preview image, but have a color explicitly listed in their frontmatter.
    //
    // We will create new images using the default preview image as the
    // template, but using the page specific colors to tint it using the
    // "duotone" transform option provided by ImageSharp nodes.
    //
    // This is complicated by the fact that we cannot run Gatsby graphql queries
    // in sourceNodes because the graphql schema doesn't exist yet.
    //
    // > Note that we cannot call createNode during createPages, which is why we
    //   need to split this logic across multiple stages.
    //
    // Luckily, even if a bit more involved, it is possible to access existing
    // nodes through functions passed by Gatsby to the node APIs.

    /* This is the GraphQL query that we're trying to emulate

        allFile(
            filter: {
                sourceInstanceName: { eq: "pages" },
                name: { eq: "preview" }
                ext: { regex: "/\\.(jpg|png)/" }
            }
        ) {
            nodes {
                root
                relativeDirectory
            }
        }
    */
    const allFile = getNodesByType("File");
    const pagePreviewFiles = allFile.filter(
        (node) =>
            node["sourceInstanceName"] === "pages" &&
            node["name"] === "preview" &&
            (node["ext"] === ".png" || node["ext"] === ".jpg"),
    );
    // A set of page slugs corresponding to which there already exists a custom
    // preview image.
    const pagesWithPreviews = new Set(
        pagePreviewFiles.map((node) =>
            [
                ensureString(node.root),
                ensureString(node.relativeDirectory),
            ].join(""),
        ),
    );

    /* This is the GraphQL query that we're trying to emulate

        allMdx(filter: {frontmatter: {colors: {ne: null}}}) {
            nodes {
                 id
                 frontmatter {
                     colors
                 }
                 fields {
                     slug
                 }
            }
        }
    */

    const allMdx = getNodesByType("Mdx");
    const mdxWithoutPreviews = allMdx.flatMap((node) => {
        const id = ensureString(node?.id);
        const slug = ensureString(
            (node?.fields as { slug: unknown } | undefined | null)?.slug,
        );
        if (pagesWithPreviews.has(slug)) return [];

        const colors = (
            node?.frontmatter as { colors: unknown } | undefined | null
        )?.colors;
        if (!Array.isArray(colors)) return [];

        return [{ id, slug, colors }];
    });
    reporter.info(
        `XXX #${mdxWithoutPreviews.length} pages have no preview but have explicit colors`,
    );
    console.log(mdxWithoutPreviews);
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
