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
    /**
     * Record a single loop, and trigger a download when done.
     *
     * This method is structured such that it can be directly called from the
     * {@link didPlay} callback to {@link useWebAudioFilePlayback}, reducing the
     * amount of code that has to be uncommented / changed to record the canvas
     * (we don't need recording functionality in the actual site).
     *
     * The method supports specifying an optional `duration` seconds, but if
     * that is not specified it determines the duration from the length of the
     * buffer associated with the passed in `audioSourceNode`.
     *
     * Once the recording is complete, this method will save it to an in-memory
     * file and trigger a download of the resultant file.
     *
     * @param shouldRecord A boolean to control recording. If false, then the
     * method call will be a no-op. This parameter is provided to reduce the
     * amount of code that is needed at the call site, and make it easier to
     * disable / enable recording without shuffling a lot of code.
     *
     * @param audioContext The AudioContext in which audio is being played.
     *
     * @param audioSourceNode The AudioNode that is playing the audio file that
     * we wish to record. If a duration is not specified, then we use the length
     * of this file to determine the duration of the loop that we should record.
     *
     * @param duration An optional duration, in seconds. If not specified, a
     * duration will be deduced from the `audioSourceNode`.
     *
     * Known issues
     * ------------
     *
     * - The recording won't be sample accurate, and so will not loop properly.
     *
     * - The stream is recorded in a compressed format ("webm" on Chrome and
     *   "mp4" on Safari). In terms of quality, the mp4 produced by Safari is
     *   slightly better (at least for the examples I tested with).
     *
     * Both of these are problematic, thus we don't currently use this class.
     * Instead, we use a slightly more involved method of saving individual
     * frames and then stiching them together (with the audio). See the
     * `recordIfNeeded` function in `record.ts`.
     */
    record(
        shouldRecord: boolean,
        audioContext: AudioContext,
        audioSourceNode: AudioBufferSourceNode,
        duration?: number
    ) {
        if (!shouldRecord) return;

        if (!duration) duration = ensure(audioSourceNode.buffer?.duration);
        console.log(`Starting recording, will stop after ${duration} seconds`);

        const canvasFrameRate = 60;

        // Assume there is only one canvas, and that's the one that p5 uses
        const canvas = ensure(document.querySelector("canvas"));
        // The return value is a reference to a MediaStream object, which has a
        // single CanvasCaptureMediaStreamTrack in it.
        const mediaStream = canvas.captureStream(canvasFrameRate);

        // Add the audio as a track to the media stream that is being recorded.
        const audioStreamDestination =
            audioContext.createMediaStreamDestination();
        audioSourceNode.connect(audioStreamDestination);
        const audioStream = audioStreamDestination.stream;
        const audioTrack = ensure(audioStream.getTracks()[0]);
        mediaStream.addTrack(audioTrack);

        let recorder: MediaRecorder | undefined = new MediaRecorder(
            mediaStream
        );
        let startTime: number;

        // Fires when the entire media has been recorded. The event, of type
        // BlobEvent, contains the recorded media in its data property.
        //
        // In our case, this'll fire when a chunk has been recorded since we
        // explicitly pass a millisecond time slice to the `start` method below.
        //
        // The intent is that passing the chunk duration will allow us to use
        // the (hopefully) more accurate timeslicing built into MediaRecorder to
        // stop the recording and get a clip that more accurately matches the
        // specified duration.
        recorder.ondataavailable = (event) => {
            if (!recorder) return;

            // Stop when we get the first chunk. The callback will get called
            // again when the recording is stopped, but we'll ignore the second
            // chunk.
            recorder.stop();

            const recordedDuration = (performance.now() - startTime) / 1000;
            console.log(`Recording done - ${recordedDuration} seconds`);

            const blob = event.data;
            // Chrome saves it as webm, Safari as MP4. So we need to look at the
            // MIME type to determine the extension. Use a hacky way to obtain
            // the extension that works at least for these two types.
            const ext = recorder.mimeType.split("/")[1]?.split(";")[0];
            FileSaver.saveAs(blob, `canvas.${ext}`);

            recorder = undefined;
        };

        startTime = performance.now();
        // If we don't pass a timeslice, the `ondataavailable` would get invoked
        // when we call `stop` on the recorder. In our case, we do pass a
        // timeslice so that we get a first chunk of the exact duration that we
        // need, and then we stop recording.
        recorder.start(duration * 1000);
    }
}
