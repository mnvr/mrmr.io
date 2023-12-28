/**
 * Return true if running in a development environment.
 *
 * Specifically, this is set by `gatsby develop` (unless explicitly overridden
 * by an environment variable set in the shell where `gatsby develop` was ran).
 */
export const isDevelopment = () => process.env.NODE_ENV === "development";

/**
 * Time how long the execution of a given function takes, and print it out on
 * the console.
 */
export const timed = <T>(f: () => T): T => {
    const start = performance.now();
    const result = f();
    const end = performance.now();
    const ms = Math.round(end - start);
    console.info(`timed function took ${ms} ms`);
    return result;
};
