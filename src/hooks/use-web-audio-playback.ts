import * as React from "react";
import { ensure } from "utils/ensure";
import { loadAudioBuffer, loopAudioBuffer } from "webaudio/audio";

type UseWebAudioPlaybackReturn = [
    /** If playback is currently active */
    isPlaying: boolean,
    /**
     * If the user has initiated playback, but we're waiting for the file load
     * to complete.
     */
    isLoading: boolean,
    /**
     * Toggle playback
     *
     * Whether or not playback actually starts depends on whether the load has
     * completed.
     */
    toggleShouldPlay: () => void
];

/**
 * A React hook to wrap the playback and loading state of a single audio file,
 * played back using WebAudio.
 *
 * The hook will initiate the loading of the URL into an audio buffer.
 * Subsequently, it'll maintain a playback state, and expose a way to toggle the
 * playback state.
 *
 * The playback can be toggled in response to user action. If the playback is
 * started before the audio buffer has been fetched, then the hook will
 * transition into a loading state.
 *
 * @param url The URL of the audio file (MP3) that should be played.
 *
 * @returns A {@link UseWebAudioPlaybackReturn} `[isPlaying, isLoading,
 * toggleShouldPlay]`
 */
export const useWebAudioFilePlayback = (
    url: string
): UseWebAudioPlaybackReturn => {
    // Track the user's intent (whether or not they've pressed the play button).
    // Whether or not we're actually playing right now (`isPlaying` below)
    // depends on if the audio buffer has been loaded.
    const [shouldPlay, setShouldPlay] = React.useState(false);

    // Creating the audio context here is permitted – the audio context will
    // start off in the suspended state, but we'll resume it later on user
    // interaction (when the user taps the play button).
    //
    // However, creating the audio context here (instead of on first user
    // interaction) causes Chrome to print a spurious warning on the console.
    //
    // But we do need the audio context to decode the audio buffer, so we cannot
    // delay creating it until the first user interaction.
    //
    // So why not create it here? Because of SSR – when Gatsby pre-builds the
    // static HTML, the window object is not available. So this property needs
    // to start off as `undefined`, but we create it immediately on page load,
    // in the useEffect below.
    const [audioContext, setAudioContext] = React.useState<
        AudioContext | undefined
    >();

    // The audio buffer into which our audio file is loaded into.
    //
    // The AudioNode for playing this back created when the audio buffer is
    // loaded. Subseqently playback is controlled by pausing / resuming the
    // audio context itself. See below for details on why it is this way.
    //
    // Pausing WebAudio nodes
    // ----------------------
    //
    // WebAudio nodes cannot be started / stopped more than once.
    //
    // An alternative is to create a source audio node right at the time of
    // playback, and disconnect (and destroy) it when the user pauses.
    // Subsequent playback will create a new node. However, this method has the
    // issue that the playback position is lost on resume – playback restarts
    // from the beginning.
    //
    // One way around this is to use the playbackRate property (e.g.
    // `playbackRate.value = 0`) to pause, and subsequently resume the node.
    // This is a bona-fide solution, and would suffice too: However, in case we
    // have a more complicated audio routing graph, modifying playback rates
    // individually would get cumbersome.
    //
    // So, we use the other alternative - pausing and resuming the audio context
    // itself. When doing this though, we have to be careful to ensure that the
    // first resume of the audio context happens in response to user
    // interaction, so as to satisfy the browser's autoplay blocking policies.
    //
    // References:
    // - https://github.com/WebAudio/web-audio-api-v2/issues/105
    const [audioBuffer, setAudioBuffer] = React.useState<
        AudioBuffer | undefined
    >();

    // Load the audio file immediately on page load
    React.useEffect(() => {
        // Create an audio context when the useEffect first runs. We cannot do
        // it when creating the useState because the window object is not
        // present during SSR.
        const ac = audioContext ?? new AudioContext();
        if (!audioContext) setAudioContext(ac);

        // When navigating back to the page from the browser's history, a new
        // audio context will get created. But this time around, the browser
        // will not apply the autoplay restrictions since the user had already
        // initiated playback on that page. So as soon as we'll connect and
        // start the AudioNodes to the destination, audio will start playing.
        //
        // This might be jarring, and unexpected. Thus, force the audio context
        // to be in a suspended state so that the behaviour of the page is the
        // same – both on initial load, or on navigating back via the browser's
        // history.
        ac.suspend();

        loadAudioBuffer(ac, url)
            .then((ab) => {
                setAudioBuffer(ab);
                loopAudioBuffer(ac, ab);
            })
            .catch((e) => {
                console.warn(e);
            });

        return () => {
            // Suspend the existing context when navigating away from the page
            // to stop sounds.
            ac.suspend();
        };
    }, []);

    const toggleShouldPlay = () => {
        const shouldPlayNew = !shouldPlay;
        const ac = ensure(audioContext);

        // Play / pause is implemented by resuming or suspending the audio
        // context itself. This achieves two ends:
        //
        // 1. The first time around, we need to resume the audio context in
        //    response to user interaction so that the browser's autoplay policy
        //    is satisfied. See
        //    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
        //
        // 2. Thereafter, resuming / suspending the audio context itself is an
        //    easy way to implement play / pause without keeping around extra
        //    state. See the "Pausing WebAudio nodes" comment above.

        if (shouldPlayNew) {
            ac.resume();
        } else {
            ac.suspend();
        }

        setShouldPlay(shouldPlayNew);
    };

    const isPlaying = shouldPlay && !!audioBuffer;
    const isLoading = shouldPlay && !audioBuffer;

    return [isPlaying, isLoading, toggleShouldPlay];
};
