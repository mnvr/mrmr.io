/**
 * Parse a list of tags
 *
 * Tags in the frontmatter are an array of strings. However, it is a bit twisted
 * to clean up the types so that we discard the undefineds (both within the array
 * of strings, and for the array itself), hence this convenience method.
 */
export const parseTags = (tags?: readonly (string | undefined)[]): string[] =>
    tags?.filter((t): t is Exclude<typeof t, undefined> => t !== undefined) ??
    [];
