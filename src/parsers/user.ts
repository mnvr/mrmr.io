/**
 * An interface for methods that expect a few subset of the user fields
 *
 * This is not a well-defined concept, it is more of an small-ish subset that is
 * often handy as an intermediate step of constructing the full user object.
 */
export interface Userish {
    /**
     * The (full) name of the user.
     */
    name?: string;
    /** The username */
    username: string;
    /** The slug for the user's home page within the site */
    slug: string;
}

/** Deduce a first name for the given user-like object */
export const firstNameOrFallback = ({ name, username }: Userish) => {
    if (!name) return username;
    return name.split(/\s/)[0] ?? name;
};
