import * as React from "react";

/**
 * Create and return a new component scoped audio context accessor.
 *
 * 1. Lazily create a new audio context the first time it is accessed through
 *    the returned accessor function.
 *
 * 2. Save a ref to this audio context so that subsequent invocations don't
 *    create a new one.
 *
 * 3. Automatically "resume" the audio context.
 */
export const useAudioContext = () => {
    const audioContextRef = React.useRef<AudioContext | undefined>(undefined);

    const getAudioContext = () => {
        let ac = audioContextRef.current;
        if (!ac) {
            ac = new AudioContext();
            audioContextRef.current = ac;
        }
        // See: [Note: Safari iOS "interrupted" AudioContext]
        ac.resume();
        return ac;
    };

    return getAudioContext;
};
