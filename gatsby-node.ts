import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import path from "path";

// Need to use the full path here to, using absolute paths with automatic "src"
// prefixing doesn't work in gatsby-node.ts.
import {
    ensureIsPageType,
    PageTemplateContext,
    UserTemplateContext,
} from "./src/types/gatsby";
import { ensure } from "./src/utils/ensure";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    node,
    getNode,
    actions,
}) => {
    const { createNodeField } = actions;

    // Create and attach a "slug" field to all MDX nodes.
    //
    // Use the slug to determine and attach "username" and "type" fields too.
    if (node.internal.type == "Mdx") {
        // Do not add a trailing slash to the generated paths.
        // This matches the `trailingSlash` option in `gatsby-config.ts`.
        const trailingSlash = false;
        const slug = createFilePath({ node, getNode, trailingSlash });

        const username = ensureValidUsername(slug);
        const type = isUserIndex(slug) ? "user" : "page";

        const newFields = { slug, username, type };

        Object.entries(newFields).forEach(([name, value]) => {
            createNodeField({
                node,
                name,
                value,
            });
        });
    }
};

/**
 * Extract and return the username from the slug.
 *
 * Throw an error if the username is not cool.
 */
const ensureValidUsername = (slug: string) => {
    // First (logical) component of the slug is the username.
    //
    // Since the slug begins with a slash, the first array component is the
    // empty string, e.g.
    //
    //     split("/mnvr/page") => ["", "mnvr", "page"]
    const username = ensure(slug.split("/", 2)[1]);

    // Run through the checks ---

    // Should be at last 4 characters in length
    if (username.length < 4) {
        throw new Error(
            `Invalid username "${username}" - it should be at least 4 characters in length.`
        );
    }

    return username;
};

/** Return `true` if the given slug is for a user's home / index page. */
const isUserIndex = (slug: string) => slug.split("/").length === 2;

type Context = UserTemplateContext | PageTemplateContext;

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
                        username
                        type
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
        `Creating pages from MDX files [${nodes.length}]`
    );
    activity.start();

    try {
        nodes.forEach((node) => {
            const id = node.id;
            const slug = ensure(node.fields?.slug);
            const username = ensure(node.fields?.username);
            const type = ensureIsPageType(ensure(node.fields?.type));
            const contentFilePath = ensure(node.internal?.contentFilePath);

            const templatePath = path.resolve(`src/templates/${type}.tsx`);

            createPage<Context>({
                path: slug,
                component: `${templatePath}?__contentFilePath=${contentFilePath}`,
                context:
                    type == "user" ? { username } : { username, pageID: id },
            });
        });
    } catch (err) {
        activity.panicOnBuild("Error creating pages from MDX content: ", err);
        return;
    }

    activity.end();
};
