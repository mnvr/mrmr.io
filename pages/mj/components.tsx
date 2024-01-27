import * as React from "react";
import styled from "styled-components";
import { useAudioContext } from "webaudio/use-audio-context";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    margin: 1em;
    display: flex;
    flex-direction: column;
    gap: 4em;

    margin-block-end: 8em;
`;

export const Section: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Section_>{children}</Section_>;
};

const Section_ = styled.section`
    display: flex;
    flex-wrap: wrap;
`;

export const Box: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Box_>{children}</Box_>;
};

const Box_ = styled.section`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    column-gap: 2em;
    align-items: center;
    margin-block-end: 1em;

    pre {
        margin-inline: 0;
    }
`;

export const Explanation: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <Explanation_>{children}</Explanation_>;
};

const Explanation_ = styled.div`
    max-width: 20em;

    ol {
        padding-inline-start: 1em;
    }
`;

export const SoundFirst: React.FC = () => {
    const audioContext = useAudioContext();
    const [oscNode, setOscNode] = React.useState<OscillatorNode | undefined>();

    const handleClick = () => {
        if (oscNode) {
            oscNode.stop();
            setOscNode(undefined);
        } else {
            const ctx = audioContext();
            const osc = new OscillatorNode(ctx);
            const mix = new GainNode(ctx, { gain: 0.1 });
            osc.connect(mix).connect(ctx.destination);
            osc.start();
            setOscNode(osc);
        }
    };

    return <button onClick={handleClick}>{oscNode ? "Pause" : "Play"}</button>;
};

export const SoundBeep: React.FC = () => {
    const audioContext = useAudioContext();
    const [intervalID, setIntervalID] = React.useState<number | undefined>();

    const handleClick = () => {
        const ctx = audioContext();
        const beep = () => {
            const osc = new OscillatorNode(ctx);
            const mix = new GainNode(ctx, { gain: 0.1 });
            osc.connect(mix).connect(ctx.destination);
            osc.start();
        };

        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(undefined);
        } else {
            const iid = window.setInterval(() => {
                beep();
            }, 1500);
            setIntervalID(iid);
        }
    };

    return (
        <button onClick={handleClick}>{intervalID ? "Pause" : "Play"}</button>
    );
};
