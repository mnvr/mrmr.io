import { repl } from "@strudel.cycles/core";
import { webaudioOutput, getAudioContext } from "@strudel.cycles/webaudio";

/** Connect Strudel's core to the WebAudio renderer */
export const connectWebAudio = () => {
    const ctx = getAudioContext();

    const { scheduler } = repl({
        defaultOutput: webaudioOutput,
        getTime: () => ctx.currentTime,
    });

    return scheduler;
};
