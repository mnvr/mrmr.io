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
 * A listing of "notes and playgrounds".
 *
 * Notes are pages under the `/notes` path, or unlisted pages outside of /notes
 * with the "playground" attribute. They are of a more quick and dirty quality
 * than regular posts (the former), or are gists / playgrounds demoing some
 * particular aspect (the latter).
 */
const NotesPage: React.FC<PageProps<Queries.NotesPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <PageListingContent pages={pages}>
            <Title_>
                notes <span>& playgrounds</span>
            </Title_>
        </PageListingContent>
    );
};

export default NotesPage;

const Title_ = styled.div`
    color: slategray;
    span {
        opacity: 0.5;
        font-size: 80%;
    }
`;

export const Head: HeadFC = () => {
    const titlePrefix = "Notes";
    const description =
        "Listing of notes and playgrounds at mrmr.io. " +
        "Notes are of more quick and dirty quality than regular posts. Playgrounds are gists that demo an aspect of some task. These are usually programming related.";
    const canonicalPath = "/notes";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages under /notes or with the "playground" attribute, sorted by
 * recency.
 *
 * For pages with the "playground" attribute, INCLUDE pages that are marked
 * unlisted`. This is in contrast to all other listings. To unlist a note,
 * either
 * 1. keep it under the notes/ director but mark it unlisted, or
 * 2. keep it outside the /notes/ directory but don't add the "note" attribute
 *    to it (while marking it unlisted).
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
