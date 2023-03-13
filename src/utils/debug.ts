/**
 * Return true if running in a development environment.
 *
 * Specifically, this is set by `gatsby develop` (unless explicitly overridden
 * by an environment variable set in the shell where `gatsby develop` was ran).
 */
export const isDevelopment = () => process.env.NODE_ENV === "development";
