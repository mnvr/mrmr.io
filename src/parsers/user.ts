interface Userish {
    /**
     * The (full) (display) name of the user.
     */
    name?: string;
    /** The username */
    username: string;
}

/** Deduce a first name for the given user-like object */
export const firstNameOrFallback = ({ name, username }: Userish) => {
    if (!name) return username;
    return name.split(/\s/)[0] ?? name;
};
