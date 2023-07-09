/** Utilities that are helpful to record sketches */

import FileSaver from "file-saver";
import type p5Types from "p5";
import { type AudioMarkers } from "p5/audio";
import { ensure } from "utils/ensure";

/**
 * Set the canvas background, but to an arbitrary CSS color.
 *
 * The `background` method provided by P5 first converts colors to its own
 * internal representation. This only supports basic SRGB colors, so we cannot
 * do something like the following:
 *
 *     p5.background("oklch(72.5% 0.19 45)");
 *
 * As an alternative, we roll our own implementation.
 *
 * Use case
 * --------
 *
 * Why do we need to set a background though? For recording.
 *
 * During normal rendering, we can just use `p5.clear`. Using clear instead of
 * `p5.background` at the start of the sketch out the state of the canvas to a
 * transparent background, and thus the background of the page shows through.
 * This way, we do not need to specify the background color as a p5.Color, and
 * can use a more vibrant color specified e.g. using OKLCH.
 *
 * However, this doesn't work when recording, because the frames captured by
 * `p5.saveFrame` end up with a transparent background (this is expected, since
 * saveFrame saves the state of the canvas, not of the page).
 *
 * So when recording, we need to use this function and explicitly set a
 * background color of the canvas.
 */
export const backgroundCSS = (p5: p5Types, cssColorString: string) => {
    const context = p5.drawingContext;
    if (!(context instanceof CanvasRenderingContext2D))
        throw new Error(
            "backgroundCSS is currently only implemented for 2D drawing contexts"
        );
    context.fillStyle = cssColorString;
    context.fillRect(0, 0, p5.width, p5.height);
};

/**
 * Save a frame of the canvas if we're still rendering the first loop of audio.
 *
 * We use the current state of audio playback (provided to us as the `audio`
 * param) to determine if we're still rendering the first loop of audio. If so,
 * we save a PNG rendering of the current state of the canvas using the
 * `p5.saveFrame` method.
 *
 * Recording a canvas with audio
 * -----------------------------
 *
 * A thorough discussion of the alternatives is provided in
 * {@link CanvasRecorder}. The gist is that to have a high-quality recording
 * that also loops perfectly to the audio, we need to manually save the frames
 * (using this `recordIfNeeded` function). And then use `ffmpeg` to stitch them
 * together (alongwith the audio).
 *
 * Usage:
 *
 * 1. Add a call to `recordIfNeeded` at the end of the sketch. You'll also
 *    likely need to add a call to `backgroundCSS` at the beginning of the
 *    sketch (right after `p5.clear`).
 */
export const recordIfNeeded = (p5: p5Types, audio: AudioMarkers) => {
    if (audio.audioTime > 0 && audio.audioTime < audio.track.duration) {
        const fc = p5.frameCount;
        // Generate a number representation with up to 6 leading zeros
        const ns = (fc + 1000000).toString().slice(-6);
        // p5.saveCanvas(`canvas-${ns}`, "png");
        const canvas = p5.drawingContext.canvas;
        if (!(canvas instanceof HTMLCanvasElement))
            throw new Error(
                "Only recording of on-screen HTML canvases is currently supported"
            );
        const remainingTime = audio.track.duration - audio.audioTime;
        console.log("recordIfNeeded", { fc, remainingTime });
        canvas.toBlob((blob) => {
            console.log("toBlob        ", { fc, remainingTime });

            // Trigger the downloads after we're done recording. This is an
            // attempt to try and ensure a smoother frame rate.
            setTimeout(() => {
                console.log(`canvas-${ns}.png`);
                if (false) FileSaver.saveAs(ensure(blob), `canvas-${ns}.png`);
            }, remainingTime * 1000);
        }, "image/png");
        // p5.save(`/tmp/b/canvas-${ns}.png`, );
    }
};
