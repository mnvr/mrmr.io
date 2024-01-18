import { repl } from "@strudel/core";
import { getAudioContext, webaudioOutput } from "@strudel/webaudio";

/** Connect Strudel's core to the WebAudio renderer */
export const connectWebAudio = () => {
    const ctx = getAudioContext();

    const { scheduler } = repl({
        defaultOutput: webaudioOutput,
        getTime: () => ctx.currentTime,
    });

    return scheduler;
};
