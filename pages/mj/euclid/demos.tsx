import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { useAudioContext } from "webaudio/use-audio-context";
import { beep } from "../sound";

export const E38: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const [seqIndex, setSeqIndex] = React.useState(0);
    const seq = [1, 0, 0, 1, 0, 0, 1, 0];

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(
                    () =>
                        setSeqIndex((seqIndex) => (seqIndex + 1) % seq.length),
                    (1000 * 1) / 7,
                ),
            );
        }
    };

    React.useEffect(() => {
        if (intervalID && seq[seqIndex] === 1) {
            beep(getAudioContext(), 0.01);
        }
    }, [seqIndex]);

    return (
        <div>
            <Beats>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && v === 1 && i === seqIndex ? "on" : ""
                        }
                    />
                ))}
            </Beats>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </div>
    );
};

const Beats = styled.div`
    height: 100px;
    margin-block: 1em;

    display: flex;
    gap: 18px;

    & > div {
        width: 10px;
        border: 1px solid tomato;
    }

    & > div.on {
        background-color: tomato;
    }
`;

const synth = (
    ctx: AudioContext,
    duration: number,
    freq: number,
    attack = 0.001,
    release = 0.1,
) => {
    const osc = new OscillatorNode(ctx, {
        type: "triangle",
        frequency: freq,
    });
    const env = new GainNode(ctx, { gain: 0.3 });
    const t = ctx.currentTime;
    env.gain.setValueCurveAtTime([0, 0.2], t, attack);
    // env.gain.setTargetAtTime(0, t + attack + duration, release / 5);

    const lfo = new OscillatorNode(ctx, {
        type: "sine",
        frequency: 0.1,
    });
    const lfoGain = new GainNode(ctx, {
        gain: 30,
    });
    lfo.connect(lfoGain).connect(osc.detune);
    lfo.start();

    const mix = new GainNode(ctx, { gain: 0.1 });

    osc.connect(env).connect(mix).connect(ctx.destination);
    osc.start();
    // osc.stop(t + attack + duration + release);
    return osc;
};

export const SoundEuclidean: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const [seqIndex, setSeqIndex] = React.useState(0);
    const seq = [1, 0, 0, 1, 0, 0, 1, 0];
    // const seq2 = [1, 0, 1, 0, 1, 0, 1, 0];
    // const seq2 = [1, 0, 1, 1, 1, 1, 1, 1];
    const seq2 = [1, 0, 1, 0, 1, 0, 1, 1];

    const seq3 = [1, 0, 1, 0, 1];
    const seq3b = [1, 0, 0, 1, 0];
    const [seqIndex3, setSeqIndex3] = React.useState(0);

    const [osc1, setOsc1] = React.useState<OscillatorNode | undefined>(
        undefined,
    );

    const [osc2, setOsc2] = React.useState<OscillatorNode | undefined>(
        undefined,
    );

    const [osc3, setOsc3] = React.useState<OscillatorNode | undefined>(
        undefined,
    );

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
            osc1?.stop();
            setOsc1(undefined);
            osc2?.stop();
            setOsc2(undefined);
            osc3?.stop();
            setOsc3(undefined);
        } else {
            setOsc1(synth(getAudioContext(), 1, 220, 1, 1));
            // setOsc2(synth(audioContext(), 1, 110, 1, 1));
            setOsc3(synth(getAudioContext(), 1, 330, 1, 1));

            setOsc2(synth(getAudioContext(), 1, 487, 1, 1));

            setIntervalID(
                window.setInterval(
                    () => {
                        setSeqIndex((seqIndex) => (seqIndex + 1) % seq.length);
                        setSeqIndex3(
                            (seqIndex3) => (seqIndex3 + 1) % seq3.length,
                        );
                    },
                    (1000 * 1) / 7,
                ),
            );
        }
    };

    // console.log(seqIndex);

    React.useEffect(() => {
        if (intervalID && seq[seqIndex] === 1) {
            // console.log("play");
            beep(getAudioContext(), 0.01);
        }
        if (intervalID && seq2[seqIndex] === 1) {
            // console.log("play");
            // beep(audioContext(), 0.02, 0.01, 0.01);
            beep(
                getAudioContext(),
                0.02 + 0.1 * ensure(seq3[seqIndex3]),
                0.01 + 0.1 * (1 - ensure(seq3[seqIndex3])),
                0.01 + 0.1 * ensure(seq3b[seqIndex3]),
            );
        }
    }, [seqIndex, seqIndex3]);

    return (
        <div>
            <E_>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && v === 1 && i === seqIndex
                                ? "playing"
                                : ""
                        }
                    />
                ))}
            </E_>
            <E_>
                {seq2.map((v, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && v === 1 && i === seqIndex
                                ? "playing"
                                : ""
                        }
                    />
                ))}
            </E_>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </div>
    );
};

const E_ = styled.div`
    /* border: 1px solid tomato; */
    width: 40em;
    height: 100px;
    margin-block-end: 1em;

    display: flex;
    gap: 1em;

    & > div {
        width: 10px;
        border: 1px solid tomato;
    }

    & > div.playing {
        background-color: tomato;
    }
`;
