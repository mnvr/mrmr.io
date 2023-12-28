import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { filterDefined } from "utils/array";
import { ensure, ensureString } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * A template page for showing the list of pages with the given tag.
 *
 * At build time, Gatsby will build one of these at "/t/slug", for each of the
 * slugs defined in `data/tags.yaml`.
 */
const TagListingPage: React.FC<PageProps<Queries.TagListingPageQuery>> = ({
    data,
    params,
}) => {
    const pages = parsePages(data);
    // Gatsby will pass us the "slug" value that it used when expanding the
    // collection route in `params`.
    const slug = ensureString(params["slug"]);

    return (
        <PageListingContent pages={pages}>
            <Title_>{slug}</Title_>
        </PageListingContent>
    );
};

export default TagListingPage;

const Title_ = styled.div`
    color: limegreen;
`;

export const Head: HeadFC = () => {
    const titlePrefix = "Programming";
    // TODO
    const description = "Listing of all pages tagged Programming on mrmr.io";
    const canonicalPath = "/t/programming";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with the "poem" attribute, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted`.
 */
export const query = graphql`
    query TagListingPage($slug: String!) {
        allMdx(
            filter: {
                frontmatter: {
                    tags: { eq: $slug }
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
        tagsYaml(slug: {eq: "quotes"}) {
            slug
            color
        }
    }
`;

const parsePages = (data: Queries.TagListingPageQuery): PageListingPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        const attributes = filterDefined(frontmatter?.attributes);
        const description = frontmatter?.description;

        return { slug, title, description, formattedDateMY, attributes };
    });
};

const parseTag = (data: Queries.TagListingPageQuery): PageListingPage[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);
        const attributes = filterDefined(frontmatter?.attributes);
        const description = frontmatter?.description;

        return { slug, title, description, formattedDateMY, attributes };
    });
};