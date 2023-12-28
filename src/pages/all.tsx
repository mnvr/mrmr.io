import { DefaultHead } from "components/Head";
import PageListingContent, {
    parsePageListingPage,
    type PageListingPage,
} from "components/PageListingContent";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** A listing of posts in the "/all" feed */
const AllPage: React.FC<PageProps<Queries.AllPageQuery>> = ({ data }) => {
    const pages = parsePages(data);
    const extraLink = <Link to={"/notes"}>Notes</Link>;

    return (
        <PageListingContent {...{ pages, extraLink }}>
            <Title_>all posts</Title_>
        </PageListingContent>
    );
};

export default AllPage;

const Title_ = styled.div`
    opacity: 0.5;
`;

export const Head: HeadFC = () => {
    const titlePrefix = "All posts";
    const description = "Listing of posts on mrmr.io";
    const canonicalPath = "/all";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch pages in the "/all" feed, sorted by recency.
 *
 * Right now this returns all pages; if this list grows too big then we can add
 * a limit here.
 */
export const query = graphql`
    query AllPage {
        allMdx(
            filter: { fields: { feed: { eq: "/all" } } }

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

const parsePages = (data: Queries.AllPageQuery): PageListingPage[] =>
    replaceNullsWithUndefineds(data.allMdx).nodes.map(parsePageListingPage);
