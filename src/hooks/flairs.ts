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
    const [flair, setFlair] = React.useState(undefined as string | undefined);
    // React uses a shallow comparison for the dependencies, so passing the
    // `flairs` array as the dependency doesn't work. As a workaround, we use a
    // string representation of the flairs array as the dependency.
    //
    // More discussion and wailing around this workaround here:
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    React.useEffect(() => {
        setFlair(flairs && randomItem(flairs));
    }, [JSON.stringify(flairs)]);
    return flair;
};
