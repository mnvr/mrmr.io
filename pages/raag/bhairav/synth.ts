/**
 * Yet Another Synth, yas.
 *
 * yas uses the WebAudio API, specifically audio worklets, to dynamically
 * generate and play sounds in a browser.
 */
class Synth {
    ctx?: AudioContext;

    /**
     * Call this method in response to a user action, like a tap.
     *
     * The browsers autoplay policy prevents JavaScript code from unilaterally
     * starting audio playback. Trying to create and use an audio context
     * without user interaction results in the browser printing a warning on the
     * console. Worse, it (and this might be undefined behaviour) enqueues any
     * existing events, and then plays them all at once when we do actually
     * trigger an audio context event in response to a user event.
     *
     * To get around this, call trigger in response to a user event, e.g. by
     * attaching a window "click" listener . This init is needed only once.
     *
     * @see {@link canAutoplay}
     */
    init() {
        if (this.ctx === undefined) this.ctx = new AudioContext();
    }

    /**
     * The {@link canAutoplay} property can be used to see if we're in a state
     * where {@link play} can be called without needing user interaction.
     */
    get canAutoplay() {
        return this.ctx !== undefined;
    }

    play({ midiNote }: PlayParams) {
        /** Play a  */
    }
}

interface PlayParams {
    /**
     * Frequency expressed as the MIDI note
     *
     * Even though we don't use MIDI, this is a convenient way of specifying
     * musical notes because integral MIDI notes correspond to semitones.
     *
     * 69 is A4, 440 Hz.
     *
     * @default 69.
     */
    midiNote: number;
}
