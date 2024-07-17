import { useAudioContext } from "hooks/use-audio-context";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { beep } from "../sound";
import { E } from "./e";

export const E38: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = useState<number | undefined>();

    const [seqIndex, setSeqIndex] = useState(0);
    const seq = [1, 0, 0, 1, 0, 0, 1, 0];
    const seq2 = E(3, 8);
    console.assert(JSON.stringify(seq) == JSON.stringify(seq2));

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(
                    () =>
                        setSeqIndex((seqIndex) => (seqIndex + 1) % seq.length),
                    1000 / 7,
                ),
            );
        }
    };

    useEffect(() => {
        if (intervalID && seq[seqIndex]) {
            beep(getAudioContext(), 0.01);
        }
    }, [intervalID, seqIndex]);

    return (
        <BeatBox>
            <Beats>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && v && i === seqIndex ? "on" : ""
                        }
                    />
                ))}
            </Beats>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </BeatBox>
    );
};

const BeatBox = styled.div`
    width: 300px;
    max-width: 100%;
`;

const Beats = styled.div`
    height: 100px;
    margin-block-start: 1em;
    margin-block-end: 1.5em;

    width: 100%;
    display: flex;
    gap: 18px;

    @media (width < 400px) {
        gap: min((100% - 12 * 10px) / 11, 18px);
    }

    & > div {
        width: 10px;
        border: 1px solid var(--mrmr-highlight-color);
        box-sizing: border-box;
    }

    & > div.on {
        background-color: var(--mrmr-highlight-color);
    }
`;

interface CycleState {
    /** The `k` in `E(k, n)` */
    k: number;
    /** The `n` in `E(k, n)` */
    n: number;
    /** The phase of (i.e. the offset into) the current E(k, n) */
    p: number;
}

const initialCycleState: CycleState = {
    k: 3,
    n: 4,
    p: 0,
};

type CycleAction = { type: "tick" };

const cycleReducer: React.Reducer<CycleState, CycleAction> = (
    state,
    action,
) => {
    switch (action.type) {
        case "tick":
            let { k, n, p } = state;
            p = p + 1;
            if (p === n) {
                p = 0;
                k = k + 1;
                if (k === n) {
                    k = n < 5 ? 1 : 3;
                    n = n + 1;
                    if (n === 13) {
                        n = 4;
                    }
                }
            }
            return { k, n, p };
    }
};

export const Cycle: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [state, dispatch] = React.useReducer(cycleReducer, initialCycleState);

    const { k, n, p } = state;
    const seq = E(k, n);

    /**
     * If we're currently playing, then this is the ID of the `setInterval` that
     * is ticking along, doing the timing for us.
     *
     * This is kept outside of the reducer's state because mutations to this
     * value involve side effects.
     */
    const [intervalID, setIntervalID] = useState<number | undefined>();

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(() => dispatch({ type: "tick" }), 1000 / 7),
            );
        }
    };

    useEffect(() => {
        if (intervalID && seq[p]) {
            beep(getAudioContext(), 0.01);
        }
    }, [intervalID, p]);

    return (
        <BeatBox>
            <CycleBeats>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={intervalID && v && i === p ? "on" : ""}
                    />
                ))}
            </CycleBeats>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </BeatBox>
    );
};

const CycleBeats = styled.div`
    height: 40px;
    margin-block-start: 1em;
    margin-block-end: 1.5em;

    display: flex;
    justify-content: space-between;

    & > div {
        width: 20px;
        border: 1px solid var(--mrmr-highlight-color);
        box-sizing: border-box;
    }

    & > div.on {
        background-color: var(--mrmr-highlight-color);
    }
`;

export const Modulate: React.FC = () => {
    const getAudioContext = useAudioContext();

    const [ko, ka, n] = [9, 4, 15];
    const onset = E(ko, n);
    const accent = E(ka, n);

    const [intervalID, setIntervalID] = useState<number | undefined>();
    /* Phase, indexes into both onset and accent */
    const [p, setP] = useState(0);

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(() => setP((p) => (p + 1) % n), 1000 / 7),
            );
        }
    };

    useEffect(() => {
        if (intervalID && onset[p]) {
            if (accent[p]) {
                beep(getAudioContext(), 0.02, 0.01, 0.1);
            } else {
                beep(getAudioContext(), 0.08, 0.001, 0.1);
            }
        }
    }, [intervalID, p]);

    return (
        <BeatBox>
            <ModulateBeats>
                {onset.map((o, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && o && p === i
                                ? accent[i]
                                    ? "accent"
                                    : "onset"
                                : ""
                        }
                    />
                ))}
            </ModulateBeats>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </BeatBox>
    );
};

const ModulateBeats = styled.div`
    height: 10px;
    margin-block-start: 1em;
    margin-block-end: 1.5em;

    display: flex;
    justify-content: space-between;

    & > div {
        width: 10px;
        border: 1px solid var(--mrmr-highlight-color);
        box-sizing: border-box;
        border-radius: 5px;
    }

    & > div.onset {
        background-color: var(--mrmr-highlight-color);
    }

    & > div.accent {
        background-color: lawngreen;
    }
`;

export const Everything: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [state, dispatch] = React.useReducer(cycleReducer, initialCycleState);
    const [intervalID, setIntervalID] = useState<number | undefined>();

    const { k, n, p } = state;
    const seq = E(k, n);

    const n8 = 8;
    const seq38 = E(3, 8);
    const seq78 = E(7, 8);

    const handleClick = () => {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            setIntervalID(
                window.setInterval(() => dispatch({ type: "tick" }), 1000 / 7),
            );
        }
    };

    useEffect(() => {
        if (intervalID) {
            if (seq38[p % n8]) {
                beep(getAudioContext(), 0.01, 0.001, 0.1, 660);
            }
            if (seq[p]) {
                beep(getAudioContext(), 0.01);
                beep(getAudioContext(), 0.005, 0.001, 0.02, 660);
            }
            if (seq78[p % n8]) {
                beep(getAudioContext(), 0.1, 0.001, 0.1, 110);
            }
        }
    }, [intervalID, p]);

    return (
        <BeatBox>
            <Beats>
                {seq38.map((v, i) => (
                    <div
                        key={i}
                        className={intervalID && v && i === p % n8 ? "on" : ""}
                    />
                ))}
            </Beats>
            <Beats>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={intervalID && v && i === p ? "on" : ""}
                    />
                ))}
            </Beats>
            <Beats>
                {seq78.map((v, i) => (
                    <div
                        key={i}
                        className={intervalID && v && i === p % n8 ? "on" : ""}
                    />
                ))}
            </Beats>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </BeatBox>
    );
};
