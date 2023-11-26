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

export const createResolvers: GatsbyNode["createResolvers"] = ({
    createResolvers,
}) => {
    /*
      Note: [Generating preview images]

      Create a resolver that handles the following query

         mdx(fields: {slug: {eq: "/evoke"}}) {
           generatedPreviewImage {
             gatsbyImageData
           }
         }

      What we wish to do is to automatically generate preview images (for use as
      the "og:image" meta tag) for pages that don't have an associated preview
      image, but have a color explicitly listed in their frontmatter.

      The actual mechanics are easy - We query the ImageSharp node of the
      default preview image to use it as a template , but use the page specific
      colors to tint it using the "duotone" transform option.

      If we do that directly in the default (template) page query, it'll
      unnecessarily run for all pages, even those without colors (there is no
      way to conditionally turn off parts of a GraphQL query). Further, we'd
      have to extract and pass the colors in the page context: all this can be
      done, but starts getting messy.

      So what we instead do is create a custom GraphQL field which resolves to
      the function below, i.e. when that field is used in the GraphQL query, our
      custom function below runs, where we can use all sorts of shenanigans to
      conditionally return the ImageSharp node.
    */
    createResolvers({
        Mdx: {
            generatedPreviewImage: {
                type: "ImageSharp",
                resolve: async (
                    source: Queries.Mdx,
                    args: unknown,
                    context: {
                        // https://www.gatsbyjs.com/docs/reference/graphql-data-layer/node-model
                        nodeModel: {
                            findOne: (
                                object: unknown,
                            ) => Promise<Queries.Node | undefined>;
                            getNodeById: (
                                object: unknown,
                            ) => Queries.Node | undefined | null;
                        };
                    },
                    info: unknown,
                ) => {
                    // Ignore pages that don't have any colors explicitly
                    // listed.
                    const colors = source.frontmatter?.colors;
                    if (!Array.isArray(colors)) return;
                    if (colors.length < 2) return;

                    const slug = ensure(source.fields?.slug);

                    // Ignore pages that have an associated preview image.
                    const previewFileNode = await context.nodeModel.findOne({
                        query: {
                            filter: {
                                sourceInstanceName: { eq: "pages" },
                                relativeDirectory: {
                                    eq: relativeDirectory(slug),
                                },
                                name: { eq: "preview" },
                                ext: { regex: "/\\.(jpg|png)/" },
                            },
                        },
                        type: "File",
                    });
                    if (previewFileNode) return;

                    const templateFileNode = await context.nodeModel.findOne({
                        query: {
                            filter: {
                                relativePath: { eq: "default/preview.png" },
                                sourceInstanceName: { eq: "assets" },
                            },
                        },
                        type: "File",
                    });
                    if (!templateFileNode) return;

                    // The node we obtain from `findOne` is from Gatsby's
                    // internal node data structures. In particular, foreign key
                    // relationships don't get resolved. For that we need to go
                    // through the GraphQL resolver, which we do here by using
                    // `getNodeById`.
                    //
                    // We need the ID of the ImageSharp child node. Whilst not
                    // guaranteed (?), we rely on the fact that for our
                    // particular File node, the ImageSharp node is the first
                    // child, and so `fileNode.children[0]` will have the ID of
                    // the ImageSharp node we want.
                    const imageSharpNode = context.nodeModel.getNodeById({
                        id: templateFileNode.children[0],
                        type: "ImageSharp",
                    });
                    console.log({ fileNode: templateFileNode, imageSharpNode });

                    // console.log(source, args, context);
                    // console.log("info", info);
                    const foo = await context.nodeModel.getFieldValue(
                        imageSharpNode,
                        "gatsbyImageData",
                    );
                    console.log(foo);

                    return imageSharpNode;
                },
            },
        },
    });
};
