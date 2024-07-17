import { DefaultHead } from "components/Head";
import PageListingContent, {
    parsePageListingPageData,
    type PageListingPage,
} from "components/PageListingContent";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** A listing of posts that are not explicitly unlisted. */
const AllPage: React.FC<PageProps<Queries.AllPageQuery>> = ({ data }) => {
    const pages = parsePages(data);
    const extraLinks = <ExtraLinks />;

    return (
        <PageListingContent {...{ pages, extraLinks }}>
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
 * Fetch pages that are not unlisted, sorted by recency.
 */
export const query = graphql`
    query AllPage {
        allMdx(
            filter: { frontmatter: { unlisted: { ne: true } } }
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
    replaceNullsWithUndefineds(data.allMdx).nodes.map(parsePageListingPageData);

const ExtraLinks: React.FC = () => {
    return (
        <div>
            <LinkToRSSFeed />
        </div>
    );
};

const LinkToRSSFeed: React.FC = () => {
    return (
        <a
            rel="alternate"
            type="application/rss+xml"
            title="All posts on mrmr.io"
            href="/rss.xml"
        >
            RSS feed
        </a>
    );
};
