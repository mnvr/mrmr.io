import * as React from "react";

/**
 * A React hook that returns the current scroll position expressed as a
 * normalized value between 0-1.
 *
 * i.e. it will return the amount that the user has scrolled on the page. 0
 * means the user is at the top of the page, 0.5 means in the middle, and 1 when
 * they're at the end.
 */
export const useScrollPosition = () => {
    const [position, setPosition] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setPosition(
                window.scrollY /
                    (document.body.scrollHeight - window.innerHeight),
            );
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return position;
};
