import FileSaver from "file-saver";
import { ensure } from "utils/ensure";

/**
 * Record the p5 canvas alongwith audio from an WebAudio source node.
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
 *
 * This class assumes that there is a single canvas element in the DOM, and
 * captures that as the video source. The audio is taken from the audio source
 * node that is passed to the start recording method.
 *
 * The recorder will then record the canvas contents and audio into a video
 * file. The duration of the recording will be the same as the length of the
 * audio file (buffer) that is loaded in the audio source node that we're using.
 * The effect we're aiming for is to record one loop of the audio (and the video
 * that accompanies it). Unfortunately, the timing of this will not be sample
 * accurate, so the recording might not loop perfectly.
 *
 * Once recording completes, the recorder will trigger a download of the video
 * file.
 */
export class CanvasRecorder {
    _recorder: MediaRecorder | undefined;

    /** Start recording */
    start(audioContext: AudioContext, audioSourceNode: AudioBufferSourceNode) {
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

        // Add the audio as a track to the media stream that is being recorded.
        const audioStreamDestination =
            audioContext.createMediaStreamDestination();
        audioSourceNode.connect(audioStreamDestination);
        const audioStream = audioStreamDestination.stream;
        const audioTrack = ensure(audioStream.getTracks()[0]);
        mediaStream.addTrack(audioTrack);

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
     * Stop the previously started recording, save it to a file and trigger a
     * download of the resultant file.
     */
    stopAndSave() {
        const recorder = ensure(this._recorder);
        this._recorder = undefined;

        recorder.stop();
    }

    /**
     * A convenience method to recording a single loop
     *
     * This method supports specifying an optional `duration` seconds, but if
     * that is not specified it determines the duration from the length of the
     * buffer associated with the passed in `audioSourceNode`.
     *
     * This method is structured such that it can be directly called from the
     * {@link didPlay} callback to {@link useWebAudioFilePlayback}, reducing the
     * amount of code that has to be uncommented to record the canvas (we don't
     * need recording functionality in the actual site).
     *
     * The recording won't be sample accurate.
     *
     * Known issues:
     *
     * - The stream is recorded in a compressed format ("webm" on Chrome and
     *   "mp4" on Safari). In terms of quality, the mp4 produced by Safari is
     *   slightly better (at least for the examples I tested with).
     *
     */
    recordIfNeeded(
        shouldRecord: boolean,
        audioContext: AudioContext,
        audioSourceNode: AudioBufferSourceNode,
        duration?: number
    ) {
        if (!shouldRecord) return;
        if (this._recorder) return;
        if (!duration) duration = ensure(audioSourceNode.buffer?.duration);
        const _this = this;
        _this.start(audioContext, audioSourceNode);
        console.log(`Starting recording, will stop after ${duration} seconds`);
        setTimeout(() => {
            _this.stopAndSave();
            console.log("Recording done");
        }, duration * 1000);
    }
}
