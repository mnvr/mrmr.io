import { ensure } from "utils/ensure";

/**
 * Record the p5 canvas
 *
 * This is a simple/minimal homegrown class for recording the canvas used by
 * p5.js onto a video. The other libraries I tried:
 *
 * - p5.capture: Didn't find a way to reliably initialize it with respect to the
 *   initialization of p5 when using a Gatsby Script tag. In particular, we need
 *   to pass the default options before the p5 init, but then later on we need
 *   to pass the handle to the p5 instance to the library, and I couldn't get
 *   these three steps to reliably dance together.
 *
 * - p5.videorecorder: Uses various window globals not accessible during SSR.
 *   Plus, it's also not in TypeScript.
 */
export class VideoRecorder {
    _recorder: MediaRecorder | undefined;

    /** Start recording */
    start() {
        if (this._recorder)
            throw new Error(
                "Attempting to start a new recording without stopping the previous one"
            );

        const frameRate = 60;

        // Assume there is only one canvas, and that's the one that p5 uses
        const canvas = ensure(document.querySelector("canvas"));
        // The return value is a reference to a MediaStream object, which has a
        // single CanvasCaptureMediaStreamTrack in it.
        const mediaStream = canvas.captureStream(frameRate);

        const recorder = new MediaRecorder(mediaStream);
        this._recorder = recorder;

        // Fires when the entire media has been recorded. The event, of type
        // BlobEvent, contains the recorded media in its data property
        recorder.ondataavailable = (event) => {
            const blob = event.data;
            // Obtain the URL to the blob in the browser's memory
            const blobURL = URL.createObjectURL(blob);
            // And redirect to it, so that we can save it.
            globalThis.window.location.replace(blobURL);
        };

        recorder.start();
    }

    /**
     * Stop the previously started recording, and redirect to the generated
     * file (so that we can save it).
     */
    stopAndRedirect() {
        const recorder = ensure(this._recorder);
        this._recorder = undefined;

        recorder.stop();
    }
}
