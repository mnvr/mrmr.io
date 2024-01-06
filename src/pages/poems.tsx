import { DefaultHead } from "components/Head";
import PageListingContent, {
    parsePageListingPageData,
    type PageListingPage,
} from "components/PageListingContent";
import { graphql, type HeadFC, type PageProps } from "gatsby";
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
    replaceNullsWithUndefineds(data.allMdx).nodes.map(parsePageListingPageData);
