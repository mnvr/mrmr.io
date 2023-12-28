import { parseColor } from "parsers/colors";
import { ensure, ensureString } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { capitalize } from "utils/string";

/**
 * A type for the parsed representation of tags.
 *
 * Tags exist in two places:
 * - In `data/tags.yaml`
 * - In the MDX page frontmatters
 *
 * This Tag type is the parsed representation of the first one. The tags as
 * specified in the MDX pages are represented by {@link FrontmatterTag}.
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
 * A tag in the frontmatter is string with some structure. It conceptually
 * consists of two bits of information - the tag itself, and the label attached
 * to it.
 *
 * - The first word of the string is taken as the tag itself.
 * - The rest of the string is taken as the label of the tag.
 *
 * For legibility, it is expected that the rest of the string is enclosed in
 * double quotes. But this is not required.

 * For example, a tag can be specified in the frontmatter this way:
 *
 *     - tags:
 *           - programming "This is a test"
 *           - programming This is a test
 *
 * Both of these will be parsed into a FrontmatterTag with tag 'programming' and
 * label 'This is a test' (without the quotes).
 *
 * Additionally, if a label is not specified then the capitalized tag will be
 * used as the label. So
 *
 *     - tags:
 *           - programming
 *
 * Will be parsed into a FrontmatterTag with tag 'programming' and label
 * 'Programming'.
 *
 * Finally, tags which match an existing entry in `data/tags.yaml` will also be
 * given a {@link slug} value. See the type {@link Tag} for more details about
 * these listings.
 */
export interface FrontmatterTag {
    tag: string;
    label: string;
    slug?: string;
}

/**
 * Parse a slug into a {@link FrontmatterTag}.
 *
 * Throws an error if it doesn't conform to the expected format.
 */
export const parseFrontmatterTag = (s: string): FrontmatterTag => {
    const [t, ...r] = s.split(" ");
    const tag = ensure(t);

    let label = r.join(" ");
    if (label.startsWith('"')) label = label.slice(1);
    if (label.endsWith('"')) label = label.slice(0, label.length - 1);

    if (!label) label = capitalize(tag);

    return { tag, label };
};
