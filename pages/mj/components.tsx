import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Container_>{children}</Container_>;
};

const Container_ = styled.div`
    margin: 1em;
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

    align-items: center;

    pre {
        margin-inline: 1em;
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

export const Code: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <Code_>{children}</Code_>;
};

const Code_ = styled.div`
    width: 10em;
`;

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
const useAudioContext = () => {
    const audioContextRef = React.useRef<AudioContext | undefined>(undefined);

    const audioContext = () => {
        let ac = audioContextRef.current;
        if (!ac) {
            ac = new AudioContext();
            audioContextRef.current = ac;
        }
        // See: [Note: Safari iOS "interrupted" AudioContext]
        ac.resume();
        return ac;
    };

    return audioContext;
};

export const Sound1: React.FC = () => {
    const audioContext = useAudioContext();
    const [oscNode, setOscNode] = React.useState<OscillatorNode | undefined>();

    const handleClick = () => {
        if (oscNode) {
            oscNode.stop();
            setOscNode(undefined);
        } else {
            const ctx = audioContext();
            const osc = new OscillatorNode(ctx);
            const mix = new GainNode(ctx, { gain: 0.3 });
            osc.connect(mix).connect(ctx.destination);
            osc.start();
            setOscNode(osc);
        }
    };

    return (
        <Button_ onClick={handleClick}>{oscNode ? "Pause" : "Play"}</Button_>
    );
};

const Button_ = styled.button`
    margin: 1em;
`;
