import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
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

const parsePages = (data: Queries.AllPageQuery): PageListingPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const description = frontmatter?.description;
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        const attributes = filterDefined(frontmatter?.attributes);

        return { slug, title, description, formattedDateMY, attributes };
    });
};
