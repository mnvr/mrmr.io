import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";
import { PageTemplateContext } from "types/gatsby";

// Need to use the full path here to, using absolute paths with automatic "src"
// prefixing doesn't work in gatsby-node.ts.
import { typeDefs } from "./src/graphql-schema";
import { ensure, ensureString } from "./src/utils/ensure";
import { hasKey } from "./src/utils/object";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    node,
    getNode,
    actions,
}) => {
    const { createNodeField } = actions;

    // - Create and attach a "slug" field to all MDX nodes.
    // - Also attach a "feed" field that indicates which all listings should
    //   this page be surfaced in.
    if (node.internal.type == "Mdx") {
        // Do not add a trailing slash to the generated paths.
        // This matches the `trailingSlash` option in `gatsby-config.ts`.
        const trailingSlash = false;
        const slug = createFilePath({ node, getNode, trailingSlash });

        console.log(feedForMdxNode(node));

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

const feedForMdxNode = (node: Record<string, unknown>) => {
    let _unlisted = false;
    let _attributes: string[] = [];

    const frontmatter = node.frontmatter;
    if (frontmatter && typeof frontmatter === "object") {
        if (hasKey(frontmatter, "unlisted")) {
            const unlisted = frontmatter.unlisted;
            if (typeof unlisted === "boolean" && unlisted) {
                _unlisted = unlisted;
            }
        }
        if (hasKey(frontmatter, "attributes")) {
            const attributes = frontmatter.attributes;
            if (Array.isArray(attributes)) {
                _attributes = attributes.map(s => ensureString(s));
            }
        }
    }

    return _unlisted;
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
                        preview_image_highlight
                        preview_image_shadow
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
                ...previewImageColorContext(node),
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

/**
 * Convert color fields (if any) specified in the MDX frontmatter into variables
 * suitable to be passed to the page query context.
 *
 * For more details, see Note: [Generating preview images].
 */
const previewImageColorContext = (node: {
    frontmatter: {
        readonly preview_image_highlight: string | null;
        readonly preview_image_shadow: string | null;
    } | null;
}) => {
    // These two page context variables are declared as "String!" in the page
    // query, and need to be defined. However, they are only accessed by the
    // page query when the custom `previewImageTemplate` field is defined, which
    // only happens when these two frontmatter fields actually are present.
    //
    // Thus it is safe to return blank strings to satisify the GraphQL type
    // checker – these blank string will not end up being used anyways.

    return {
        previewImageHighlight: node?.frontmatter?.preview_image_highlight ?? "",
        previewImageShadow: node?.frontmatter?.preview_image_shadow ?? "",
    };
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
    ({ actions }) => {
        const { createTypes } = actions;
        // See: Note: [GraphQL schema definition]
        createTypes(typeDefs);
    };

export const createResolvers: GatsbyNode["createResolvers"] = ({
    createResolvers,
}) => {
    /*
      Note: [Generating preview images]

      Create a resolver that handles the following query

         mdx(fields: {slug: {eq: "/evoke"}}) {
            previewImageTemplate {
                gatsbyImageData
            }
         }

      To overarching goal is to automatically generate preview images (for use
      as the "og:image" meta tag) for pages that have a some preview image tint
      colors explicitly listed in their frontmatter.

      To do this, we can query the ImageSharp node of the default preview image
      to use it as a template , but use the page specific colors to tint it
      using the "duotone" transform option.

      If we do that directly in the default (template) page query, it'll
      unnecessarily run for all pages, even those without colors (there is no
      way to conditionally turn off parts of a GraphQL query).

      So we create a custom GraphQL field which only resolves in case these
      preview-image-* colors are actually present in the frontmatter.
    */
    createResolvers({
        Mdx: {
            previewImageTemplate: {
                type: "ImageSharp",
                resolve: async (
                    // The current node
                    source: {
                        frontmatter: {
                            // Note that at this stage the source object has
                            // these unnormalized names (same as they occur in
                            // the MDX), not the ones in `Queries.Mdx`.
                            "preview-image-highlight": string | undefined;
                            "preview-image-shadow": string | undefined;
                        };
                    },
                    _args: unknown,
                    // Shared context across all resolvers. In particular, it
                    // provides us access to the NodeModel.
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
                ) => {
                    // Ignore pages that don't have colors explicitly listed.
                    if (
                        !source.frontmatter["preview-image-highlight"] ||
                        !source.frontmatter["preview-image-shadow"]
                    ) {
                        return;
                    }

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

                    return imageSharpNode;
                },
            },
        },
    });
};
