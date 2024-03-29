import { graphql } from "gatsby";
import { ensure } from "utils/ensure";
import { type RecursivelyReplaceNullWithUndefined } from "utils/replace-nulls";
import { parseColor } from "./colors";

/**
 * A type for the parsed representation of tags.
 *
 * Tags exist in two places:
 *
 * - In `data/tags.yaml`. This `Tag` type is their parsed representation.
 *
 * - In the MDX page frontmatter. These are represented by
 *   {@link FrontmatterTag}.
 *
 * They are linked together by the `tag` field that is present in both. Note
 * however that we can have free-form `FrontmatterTag`s too, those just have a
 * label and no tag.
 *
 * See also: Documentation of the `TagsYaml` type in graphql-schema.ts.
 */
export interface Tag {
    /**
     * The tag itself. This is a single lower case word describing the tag. It
     * is used to construct the slug, can serve as a name, and also serves as
     * the foreign-key linkage.
     *
     * We can think of this as an "id" – it's not called an "id" because that
     * would conflict with the autogenerated ID field added by Gatsby when
     * injesting `data/tags.yaml` into GraphQL.
     */
    tag: string;
    /**
     * A slug of the page that lists all pages that have this tag.
     */
    slug: string;
    /**
     * An optional color associated with the tag.
     *
     * If present, this will be a string that CSS can understand.
     */
    color?: string;
}

/**
 * A GraphQL fragment that can be emdedded in page queries to get the data
 * needed for constructing a {@link Tag} using the {@link parseTagFragment}
 * helper function.
 */
export const query = graphql`
    fragment TagData on TagsYaml {
        tag
        color
        fields {
            slug
        }
    }
`;

/**
 * Convert the tag data we get from GraphQL (as the TagData fragment defined
 * above) into the {@link Tag} type that the rest of our code uses.
 */
export const parseTagData = (
    tagsYaml: RecursivelyReplaceNullWithUndefined<Queries.TagDataFragment>,
): Tag => {
    const tag = ensure(tagsYaml.tag);
    const slug = ensure(tagsYaml.fields?.slug);
    const color = parseColor(tagsYaml.color);

    return { tag, slug, color };
};
