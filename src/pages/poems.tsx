import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** A listing of all pages with the attribute "poem" */
const PoemsPage: React.FC<PageProps<Queries.PoemsPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return <PageListingContent title="poems" pages={pages} />;
};

export default PoemsPage;

export const Head: HeadFC = () => {
    const titlePrefix = "Poems";
    const description = "Listing of all poems on mrmr.io";
    const canonicalPath = "/poems";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with the "poem" attribute, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted`.
 */
export const query = graphql`
    query PoemsPage {
        allMdx(
            filter: {
                frontmatter: {
                    attributes: { in: "poem" }
                    unlisted: { ne: true }
                }
            }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    title
                    description
                    formattedDateMY: date(formatString: "MMM YYYY")
                    attributes
                }
                fields {
                    slug
                }
            }
        }
    }
`;

const parsePages = (data: Queries.PoemsPageQuery): PageListingPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        const attributes = filterDefined(frontmatter?.attributes);

        const desc = frontmatter?.description;
        const description = attributes.includes("hindi")
            ? pruneHindiDescription(desc)
            : pruneDescription(desc);

        return { slug, title, description, formattedDateMY, attributes };
    });
};

/**
 * Strip off "A poem" from the end of a the description field.
 *
 * The description field in poems usually ends with ". A poem\." (the first dot
 * stands for any character, the second dot is literal).
 *
 * This is fine in the context where such pages are listed otherwise, or shown
 * as a preview off-site, but in this page we already have mentioned that we are
 * just listing poems, so it is just noise (or worse even, the proliferation of
 * the word poem is bordering on an cognital infestation).
 */
const pruneDescription = (description?: string) =>
    description?.replace(/. A poem\.$/, ".");

/** Variant of {@link pruneDescription} but for hindi poems */
const pruneHindiDescription = (description?: string) =>
    description?.replace(/एक कविता।$/, "");
