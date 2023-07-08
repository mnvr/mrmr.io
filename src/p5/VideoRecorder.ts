import FileSaver from "file-saver";
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
            // Chrome saves it as webm, Safari as MP4. So we need to look at the
            // MIME type to determine the extension. Use a hacky way to obtain
            // the extension that works at least for these two types.
            const ext = recorder.mimeType.split("/")[1]?.split(";")[0];
            FileSaver.saveAs(blob, `canvas.${ext}`);
        };

        recorder.start();
    }

    /**
     * Stop the previously started recording, and save it to a file.
     */
    stopAndSave() {
        const recorder = ensure(this._recorder);
        this._recorder = undefined;

        recorder.stop();
    }

    /**
     * A convenience method to recording the next `duration` seconds.
     *
     * This method is structured such that it can be directly called from the
     * {@link didPlay} callback to {@link useWebAudioFilePlayback}, reducing the
     * amount of code that has to be uncommented to record the canvas (we don't
     * need recording functionality in the actual site).
     *
     * The recording won't be sample accurate, so it is maybe to overrecord a
     * bit and then crop out the excess part that goes beyond the audio.
     *
     * Known issues:
     *
     * - The stream is recorded in a compressed format ("webm" on Chrome and
     *   "mp4" on Safari). In terms of quality, the mp4 produced by Safari is
     *   slightly better (at least for the examples I tested with).
     *
     */
    recordIfNeeded(duration: number, isPlaying: boolean) {
        if (!isPlaying) return;
        if (this._recorder) return;
        const _this = this;
        _this.start();
        console.log(`Starting recording, will stop after ${duration} seconds`);
        setTimeout(() => {
            _this.stopAndSave();
            console.log("Recording done");
        }, duration * 1000);
    }
}
