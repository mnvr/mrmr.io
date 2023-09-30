import { P5SketchBox, type P5SketchBoxProps } from "components/P5SketchBox";
import P5CanvasInstance from "p5";
import * as React from "react";

interface ReelSizedP5SketchBoxProps
    extends Omit<P5SketchBoxProps, "computeSize"> {
    /**
     * If true, restrict the canvas to the Reel aspect ratio. Otherwise let it
     * expand to fill the window.
     */
    restrictAspectRatio?: boolean;
}

export const ReelSizedP5SketchBox: React.FC<ReelSizedP5SketchBoxProps> = (
    props,
) => {
    // Instagram's recommended Reel size is 1080x1920 pixels (9:16 aspect ratio)
    // For @3x devices, that'll translate to 1920/3 = 640 points, and we use
    // that as the height. However, if the window is smaller than that, we limit
    // to the window's height.
    const defaultHeight = 640;
    const aspectRatio = 9 / 16;

    const computeSize = (p5: P5CanvasInstance): [number, number] => {
        if (props.restrictAspectRatio) {
            // Compute the sizes based on the aspect ratios
            const height = Math.min(defaultHeight, p5.windowHeight);
            const width = height * aspectRatio;
            return [width, height];
        } else {
            // Let it expand to use the first screenful
            return [p5.windowWidth, p5.windowHeight];
        }
    };

    const ourProps = { computeSize };
    const mergedProps = { ...ourProps, ...props };

    return <P5SketchBox {...mergedProps} />;
};
