import { DefaultHead } from "components/Head";
import PageListingContent, {
    parsePageListingPageData,
    type PageListingPage,
} from "components/PageListingContent";
import { Link, graphql, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * A listing of "notes and playgrounds".
 *
 * Notes are pages in the "/notes" feed. These are (listed) pages with either
 * the "note" or the "playground" attribute.
 *
 * Conceptually, these are of a more quick and dirty quality than regular posts
 * (attribute "note"), or are gists / playgrounds demoing some particular aspect
 * (attribute "playground").
 */
const NotesPage: React.FC<PageProps<Queries.NotesPageQuery>> = ({ data }) => {
    const pages = parsePages(data);
    const extraLinks = (
        <div>
            <Link to={"/all"}>Other posts</Link>
        </div>
    );

    return (
        <PageListingContent {...{ pages, extraLinks }}>
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
        margin-inline-start: -0.5px;
        opacity: 0.5;
        font-size: 80%;
    }
`;

export const Head: HeadFC = () => {
    const titlePrefix = "Notes";
    const description = "Listing of notes and playgrounds at mrmr.io. ";
    const canonicalPath = "/notes";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages in the "/notes" feed, sorted by recency.
 */
export const query = graphql`
    query NotesPage {
        allMdx(
            filter: { fields: { feed: { eq: "/notes" } } }
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
