import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import { parseTag, type Tag } from "parsers/tag";
import * as React from "react";
import styled from "styled-components";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { capitalize } from "utils/string";

/**
 * A template page for showing the list of pages with the given tag.
 *
 * At build time, Gatsby will build one of these at "/t/{tag.slug}", one for
 * each of the tags defined in `data/tags.yaml`.
 */
const TagListingPage: React.FC<PageProps<Queries.TagListingPageQuery>> = ({
    data,
}) => {
    const pages = parsePages(data);
    const tag = parseTags(data);

    return (
        <PageListingContent pages={pages}>
            <Title_ {...tag}>{tag.slug}</Title_>
        </PageListingContent>
    );
};

export default TagListingPage;

const Title_ = styled.div<Tag>`
    color: ${(props) => props.color ?? "var(--mrmr-color-4)"};
`;

export const Head: HeadFC<Queries.TagListingPageQuery> = ({ data }) => {
    const tag = parseTags(data);

    // All the slugs so far are single words, and so here we can use it as a
    // the "name" of the tag.
    const slug = tag.slug;

    const titlePrefix = capitalize(slug);
    const description = `Listing of all pages tagged ${slug} on mrmr.io`;
    const canonicalPath = `/t/${slug}`;

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with the given tag, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted`.
 */
export const query = graphql`
    query TagListingPage($slug: String!) {
        allMdx(
            filter: {
                frontmatter: { tags: { eq: $slug }, unlisted: { ne: true } }
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
        tagsYaml(slug: { eq: $slug }) {
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

const parseTags = (data: Queries.TagListingPageQuery) => {
    const tagsYaml = replaceNullsWithUndefineds(data.tagsYaml);
    return parseTag(ensure(tagsYaml));
};
