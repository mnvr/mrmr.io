import * as React from "react";
import { useAudioContext } from "webaudio/use-audio-context";
import { beep } from "./sound";

export const FirstSound: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [oscNode, setOscNode] = React.useState<OscillatorNode | undefined>();

    const handleClick = () => {
        if (oscNode) {
            oscNode.stop();
            setOscNode(undefined);
        } else {
            const ctx = getAudioContext();
            const osc = new OscillatorNode(ctx);
            const mix = new GainNode(ctx, { gain: 0.1 });
            osc.connect(mix).connect(ctx.destination);
            osc.start();
            setOscNode(osc);
        }
    };

    return <button onClick={handleClick}>{oscNode ? "Pause" : "Play"}</button>;
};

export const Beep: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [oscNode, setOscNode] = React.useState<OscillatorNode | undefined>();

    const handleClick = () => {
        const ctx = getAudioContext();
        const beep = (duration: number, attack = 0.001, release = 0.1) => {
            const osc = new OscillatorNode(ctx);
            const env = new GainNode(ctx);
            const t = ctx.currentTime;

            env.gain.setValueCurveAtTime([0, 1], t, attack);
            env.gain.setTargetAtTime(0, t + attack + duration, release / 5);

            const mix = new GainNode(ctx, { gain: 0.1 });

            osc.connect(env).connect(mix).connect(ctx.destination);
            osc.start();
            osc.stop(t + attack + duration + release);

            setOscNode(osc);
            osc.onended = () => {
                setOscNode(undefined);
            };
        };

        beep(0.2);
    };

    return (
        <button onClick={handleClick}>{oscNode ? "Playing" : "Play"}</button>
    );
};

export const Beeps: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(() => {
                    beep(getAudioContext(), 0.01);
                }, 1000 / 7),
            );
        }
    };

    return (
        <button onClick={handleClick}>{intervalID ? "Pause" : "Play"}</button>
    );
};
