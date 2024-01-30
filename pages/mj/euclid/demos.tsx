import * as React from "react";
import { E } from "sound/e";
import styled from "styled-components";
import { useAudioContext } from "webaudio/use-audio-context";
import { beep } from "../sound";

export const E38: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const [seqIndex, setSeqIndex] = React.useState(0);
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
                    (1000 * 1) / 7,
                ),
            );
        }
    };

    React.useEffect(() => {
        if (intervalID && seq[seqIndex] === 1) {
            beep(getAudioContext(), 0.01);
        }
    }, [intervalID, seqIndex]);

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
    margin-block-start: 1em;
    margin-block-end: 1.5em;

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

export const ManyE: React.FC = () => {
    const getAudioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const [seqIndex, setSeqIndex] = React.useState(0);
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
                    (1000 * 1) / 7,
                ),
            );
        }
    };

    React.useEffect(() => {
        if (intervalID && seq[seqIndex] === 1) {
            beep(getAudioContext(), 0.01);
        }
    }, [intervalID, seqIndex]);

    return (
        <div>
            <Beats2>
                {seq.map((v, i) => (
                    <div
                        key={i}
                        className={
                            intervalID && v === 1 && i === seqIndex ? "on" : ""
                        }
                    />
                ))}
            </Beats2>
            <button onClick={handleClick}>
                {intervalID ? "Pause" : "Play"}
            </button>
        </div>
    );
};

const Beats2 = styled.div`
    height: 20px;
    margin-block-start: 1em;
    margin-block-end: 1.5em;

    width: 300px;
    display: flex;
    justify-content: space-between;

    & > div {
        width: 20px;
        border: 1px solid tomato;
        border-radius: 2px;
    }

    & > div.on {
        background-color: tomato;
    }
`;
