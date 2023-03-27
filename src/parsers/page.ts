interface Pageish {
    /** The username of the person whose page this is */
    username: string;
    /**
     * An existing description (e.g. if one was present in the frontmatter).
     */
    description?: string;
}

/**
 * If the given page-like object has a description, return that. Otherwise
 * create and return a fallback description.
 */
export const descriptionOrFallback = ({ description, username }: Pageish) => {
    if (description) return description;
    // "music" is lowercase since the username too will (most likely) be
    // lowercased.
    return `music, words and art by @${username}`;
};
