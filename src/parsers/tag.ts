import { parseColor } from "parsers/colors";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** A type for the parsed representation of tags */
export type Tag = {
    /**
     * A lowercase slug which serves both as a unique id, and also forms the URL
     * of the listing page ("/t/slug").
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
export const parseTag = (data: Queries.TagsYaml): Tag => {
    const tagsYaml = replaceNullsWithUndefineds(data);

    const slug = ensure(tagsYaml.slug);
    const color = parseColor(tagsYaml.color);

    return { slug, color };
};
