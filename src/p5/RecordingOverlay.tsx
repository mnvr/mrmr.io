import { Script } from "gatsby";
import type p5Types from "p5";
import * as React from "react";
import { isDevelopment } from "utils/debug";

declare const P5Capture: any;

interface P5RecordingOverlayProps {
    /** Easily enable/disable the overlay by toggling this variable. */
    enable: boolean;
    /**
     * p5.capture needs to be told about the p5 instance, so hold onto the
     * reference that we get back from p5-react in the setup method.
     */
    p5: p5Types | undefined;
}

/**
 * Show an (dev mode) overlay to record the p5 canvas.
 *
 * In development mode, load p5.capture
 * (https://github.com/tapioca24/p5.capture). It is a script that shows a
 * recording overlay that allows us to save the p5 animation on the canvas
 * into a video.
 */
export const P5RecordingOverlay: React.FC<P5RecordingOverlayProps> = ({
    enable,
    p5,
}) => {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (p5 && loaded) {
            (P5Capture as any).getInstance().initialize(p5);
        }
    }, [p5, loaded]);

    const recordingScript =
        "https://cdn.jsdelivr.net/npm/p5.capture@1.4.1/dist/p5.capture.umd.min.js";

    return (
        <>
            {enable && isDevelopment() && (
                <Script
                    src={recordingScript}
                    onLoad={() => {
                        P5Capture.setDefaultOptions({
                            quality: 1,
                            verbose: true,
                        });
                        setLoaded(true);
                    }}
                />
            )}
        </>
    );
};
