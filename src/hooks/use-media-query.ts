import { useEffect, useState } from "react";

/**
 * A React hook that returns true if the given CSS {@link mediaQuery} evaluates
 * to true.
 *
 * It also observes for changes to this property and updates itself.
 */
export const useMediaQuery = (query: string) => {
    const [value, setValue] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => setValue(mql.matches);
        handleChange();
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return value;
};
