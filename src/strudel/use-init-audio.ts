import { initAudioOnFirstClick } from "@strudel/webaudio";
import * as React from "react";

/**
 * An wrapper over {@link initAudioOnFirstClick} that keeps track of whether or
 * not audio has been inited.
 *
 * This is for use in situations when we cannot directly use the
 * initAudioOnFirstClick function because we also want to track when the
 * initialization has happened (From what I can see, there isn't a
 * straightforward way of getting that information out of Strudel).
 *
 * By tracking whether or not audio has been initated (on a user action), we can
 * then not try to play audio on non-tap actions (say, hover) until the first
 * tap by the user. This is not just for hygiene - otherwise the audio playback
 * events we emit on hover get enqueued and when the user first taps they all
 * get triggered, causing a loud noise.
 *
 * @returns a boolean value indicating if audio has been initialized.
 */
export const useInitAudioOnFirstClick = (): boolean => {
    const [haveInitedAudio, setHaveInitedAudio] = React.useState(false);

    React.useEffect(() => {
        initAudioOnFirstClick();
    }, []);

    React.useEffect(() => {
        const handleClick = () => setHaveInitedAudio(true);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return haveInitedAudio;
};
