import * as React from "react";
import { randomItem } from "utils/random";

/**
 * Choose a flair at random from the given entries.
 *
 * This hook chooses a flair at random the first time the component is rendered
 * It then sticks with it thereafter, unless the flairs array itself changes.
 */
export const useFlair = (
    flairs: readonly (string | undefined)[] | undefined
) => {
    // Problem: Using a regular useState causes a layout shift because the flair
    // is picked up when the page is hydrated on the client side.
    //
    // Workaround: Choose a flair during SSR. Also remember the array we used.
    // When the component gets rerendered because useEffect is called on the
    // client side on initial render, it'll be a no-op since the array we used
    // will match the one that was used during SSR.
    //
    // This is very kludgy, but it seems to work.

    const [flair, setFlair] = React.useState(flairs && randomItem(flairs));
    const [usedFlairs, setUsedFlairs] = React.useState(flairs);

    // About using JSON.stringify:
    //
    // React uses a shallow comparison for the dependencies, so passing the
    // `flairs` array as the dependency doesn't work. As a workaround, we use a
    // string representation of the flairs array as the dependency.
    //
    // More discussion and wailing around this workaround here:
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055

    React.useEffect(() => {
        if (
            flairs &&
            usedFlairs &&
            JSON.stringify(flairs) != JSON.stringify(usedFlairs)
        ) {
            setFlair(flairs && randomItem(flairs));
            setUsedFlairs(flairs);
        }
    }, [JSON.stringify(flairs)]);

    return flair;
};
