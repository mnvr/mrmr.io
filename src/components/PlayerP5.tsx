import { ReelSizedP5SketchBox } from "components/ReelSizedP5SketchBox";
import * as React from "react";
import styled from "styled-components";
import type { P5Draw } from "types";

interface PlayerP5Props {
    /**
     * The P5 visualization to render
     *
     * See the draw property in {@link PlayerP5WebAudioProps} for more details.
     */
    draw: P5Draw;
    /**
     * If true, use a fake audio time to drive the animation.
     *
     * See the `timeProvider` property in {@link ReelSizedP5SketchBoxProps} for
     * more details.
     */
}

/**
 * Show a full screen with a reel sized P5 sketch.
 *
 * This is a variant of {@link PlayerP5WebAudio} that only shows a P5
 * visualization, without any sound. It is handy when prototyping.
 *
 * The player takes up at least the first screen height.
 */
export const PlayerP5: React.FC<React.PropsWithChildren<PlayerP5Props>> = ({
    draw,
}) => {
    return (
        <Grid>
            <ReelSizedP5SketchBox draw={draw} />
        </Grid>
    );
};

const Grid = styled.div`
    display: grid;
    place-items: center;
    min-height: 100svh;
`;
