import { ensure } from "utils/ensure";
import { loadAudioBuffer, loopAudioBuffer } from "webaudio/audio";

export const createSequencer = (mp3s: Record<string, string>) => {
    return async (ctx: AudioContext) => {
        const main = await loadAudioBuffer(ctx, ensure(mp3s["become"]));
        loopAudioBuffer(ctx, main);
    };
};
