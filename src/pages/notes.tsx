import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * A listing of "notes".
 *
 * Notes are pages under the `/notes` path, or pages with the "note" attribute.
 * They are of a more quick and dirty quality than regular posts, or are gists /
 * playgrounds demoing some particular aspect.
 */
const NotesPage: React.FC<PageProps<Queries.PoemsPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <PageListingContent pages={pages}>
            <Title_>notes</Title_>
        </PageListingContent>
    );
};

export default NotesPage;

const Title_ = styled.div`
    color: slategray;
`;

export const Head: HeadFC = () => {
    const titlePrefix = "Notes";
    const description =
        "Listing of notes at mrmr.io. " +
        "Notes are of more quick and dirty quality than regular posts, or they are gists / playgrounds demoing some particular aspect of some task, usually programming related.";
    const canonicalPath = "/notes";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with the "note" attribute or under /notes, sorted by recency.
 *
 * - INCLUDE pages with the "note" attribute that are marked `unlisted`. This is
 *   in contrast to all other listings. To unlist a note, either keep it under
 *   the notes/ path but mark it unlisted, or keep it outside the notes/ path
 *   but don't add the "note" attribute to it (while marking it unlisted).
 */
export const query = graphql`
    fragment NotesPageData on Mdx {
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

    query NotesPage {
        allMdx(
            filter: {
                frontmatter: {
                    attributes: { in: "note" }
                    unlisted: { ne: true }
                }
            }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                ...NotesPageData
            }
        }

        notesMdx: allMdx(
            filter: { fields: { slug: { glob: "/notes/*" } } }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                ...NotesPageData
            }
        }
    }
`;

const parsePages = (data: Queries.NotesPageQuery): PageListingPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const notesMdx = replaceNullsWithUndefineds(data.notesMdx);
    const nodes = [...allMdx.nodes, ...notesMdx.nodes];

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        const attributes = filterDefined(frontmatter?.attributes);

        const desc = frontmatter?.description;
        const description = pruneDescription(desc);

        return { slug, title, description, formattedDateMY, attributes };
    });
};
/**
 * TODO
 */
const pruneDescription = (description?: string) =>
    description?.replace(/. A note\.$/, ".");
