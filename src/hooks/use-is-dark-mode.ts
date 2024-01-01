import * as React from "react";

/**
 * A React hook that returns true if the browser is currently in dark mode.
 *
 * Specifically, it returns true when the `@media (prefers-color-scheme: dark)`
 * CSS media query is true. It also observes for changes to this property and
 * updates itself.
 */
export const useIsDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => setIsDarkMode(mql.matches);
        handleChange();
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return isDarkMode;
};
