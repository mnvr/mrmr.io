import { DefaultHead } from "components/Head";
import PageListingContent, {
    type PageListingPage,
} from "components/PageListingContent";
import { PageProps, graphql, type HeadFC } from "gatsby";
import { parseTagYaml, type Tag } from "parsers/tag";
import * as React from "react";
import styled from "styled-components";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { capitalize } from "utils/string";

/**
 * A template page for showing the list of pages with the given tag.
 *
 * At build time, Gatsby will build one of these at "/t/{tag.tag}" for each of
 * the tags defined in `data/tags.yaml`.
 */
const TagListingPage: React.FC<PageProps<Queries.TagListingPageQuery>> = ({
    data,
}) => {
    const pages = parsePages(data);
    const tag = parseTag(data);

    return (
        <PageListingContent pages={pages}>
            <Title_ {...tag}>{tag.tag}</Title_>
        </PageListingContent>
    );
};

export default TagListingPage;

const Title_ = styled.div<Tag>`
    color: ${(props) => props.color ?? "var(--mrmr-color-4)"};
`;

export const Head: HeadFC<Queries.TagListingPageQuery> = ({ data }) => {
    const tag = parseTag(data);

    // All the tag values are single words, and so here we can use it as a the
    // "name" for the tag.
    const name = tag.tag;

    const titlePrefix = capitalize(name);
    const description = `Listing of all pages tagged ${name} on mrmr.io`;
    const canonicalPath = tag.slug;

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with the given tag, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted`.
 */
export const query = graphql`
    query TagListingPage($tag: String!) {
        allMdx(
            filter: {
                frontmatter: {
                    tags: { elemMatch: { tag: { eq: $tag } } }
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
        tagsYaml(tag: { eq: $tag }) {
            tag
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

const parseTag = (data: Queries.TagListingPageQuery) =>
    parseTagYaml(data.tagsYaml);
