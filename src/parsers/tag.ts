import { parseColor } from "parsers/colors";
import { ensure, ensureString } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { capitalize } from "utils/string";

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
 * They are linked together by the `tag` field that is present in both. However,
 * since there can be tags in the MDX page frontmatter that are not present
 * in `data/tags.yaml`, this linking is done manually.
 */
export type Tag = {
    /**
     * The tag itself. This is a single lower case word describing the tag. It
     * is used to construct the slug, and otherwise also serves as the unique
     * identifier for the tag structure.
     */
    tag: string;
    /**
     * A slug to the listing of all pages that have this tag.
     */
    slug: string;
    /**
     * An optional color associated with the tag.
     *
     * If present, this will be a string that CSS can understand.
     */
    color?: string;
};

/**
 * Convert the tag data we get from GraphQL into the {@link Tag} type that the
 * rest of our code uses.
 */
export const parseTagYaml = (
    data: Record<string, unknown> | undefined | null,
): Tag => {
    const tagsYaml = ensure(replaceNullsWithUndefineds(data));

    const tag = ensureString(tagsYaml.tag);
    const slug = `/t/${tag}`;
    const color = parseColor(tagsYaml.color);

    return { tag, slug, color };
};

/**
 * A tag in the frontmatter (represented by the MdxFrontmatterTag GraphQL type)
 * consists of two bits of information - the tag itself, and an optional label.
 *
 * If a label is not present, then the the capitalized tag will be used as the
 * label. E.g. both of these will be parsed into a FrontmatterTag with tag
 * 'programming' and label 'Programming'
 *
 *     - tags:
 *           - tag: programming
 *             label: Programming
 *           - tag: programming
 *
 * Tags which match an existing entry in `data/tags.yaml` will also be given a
 * {@link slug} value that points to a listing of all pages that have that tag.
 * See the type {@link Tag} for more details about these listings.
 */
export interface FrontmatterTag {
    tag: string;
    label: string;
    slug?: string;
}
