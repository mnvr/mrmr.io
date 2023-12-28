import { DefaultHead } from "components/Head";
import PageListingContent, {
    parsePageListingPage,
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** A listing of all pages with the attribute "poem" */
const PoemsPage: React.FC<PageProps<Queries.PoemsPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <PageListingContent pages={pages}>
            <Title_>poems</Title_>
        </PageListingContent>
    );
};

export default PoemsPage;

const Title_ = styled.div`
    color: oklch(56.28% 0.246 286.9);
`;

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
                ...PageListingPageData
            }
        }
    }
`;

const parsePages = (data: Queries.NotesPageQuery): PageListingPage[] =>
    replaceNullsWithUndefineds(data.allMdx)
        .nodes.map(parsePageListingPage)
        .map(modifyDescription);

const modifyDescription = (page: PageListingPage): PageListingPage => {
    const { description, attributes } = page;
    const newDescription = attributes.includes("hindi")
        ? pruneHindiDescription(description)
        : pruneDescription(description);

    return { ...page, description: newDescription };
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
