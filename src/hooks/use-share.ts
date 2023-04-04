import * as React from "react";

/**
 * A rather ad-hoc React hook to reduce some of the boilerplate using the
 * WebShare API to invoke the system's default "Share UI" for sharing a link to
 * the page.
 *
 * Returns a boolean indicating if sharing is possible (so that we can hide the
 * sharing related UI if needed), and a function that can be invoked to share
 * the passed in `shareData`.
 */
export const useShare = (
    shareData: ShareData
): [canShare: boolean, handleShareClick: React.MouseEventHandler] => {
    const [canShare, setCanShare] = React.useState(true);

    React.useEffect(() => {
        setCanShare(typeof navigator.share !== "undefined");
    }, []);

    const handleShareClick: React.MouseEventHandler = async (event) => {
        try {
            await navigator.share(shareData);
        } catch (e) {
            console.error("Failed to share link", e);
        }
        event.preventDefault();
    };

    return [canShare, handleShareClick];
};
