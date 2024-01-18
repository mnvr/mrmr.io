import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

/* More like thaat, but let's live with this for now */
interface Raag {
    name: string;
    /** This is the number of semitones from the tonic (root, Sa). */
    notes: number[];
}

const raagBhairav: Raag = {
    name: "Bhairav",
    notes: [0, 1, 4, 5, 7, 8, 11],
};

export const Content: React.FC = () => {
    return <RaagContent raag={raagBhairav} />;
};

interface PropsWithRaag {
    raag: Raag;
}

export const RaagContent: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <WideColumn>
            <Title>
                <T1>ra'g</T1> {raag.name.toLowerCase()}
            </Title>
            <Raag raag={raag} />
            <TextContent>
                <Description raag={raag} />
            </TextContent>
        </WideColumn>
    );
};

const Title = styled.h1`
    font-family: serif;
    font-style: italic;
`;

const T1 = styled.span`
    color: var(--mrmr-color-4);
`;

const Raag: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <Raag_>
            {noteSequence(raag.notes).map(([i, isOn]) =>
                isOn ? (
                    <Note key={i} noteOffset={i} />
                ) : (
                    <Blank key={i} noteOffset={i} />
                ),
            )}
        </Raag_>
    );
};

const Raag_ = styled.div`
    box-sizing: border-box;
    padding-block: 1rem;
    min-height: 80svh;
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 4px;
    justify-content: space-evenly;

    & > div {
        width: 50%;
        /* Don't let anything shrink */
        flex-shrink: 0;
        /* Give all the items a fixed height */
        flex-basis: 12px;
        border-radius: 4px;
    }
`;

const noteSequence = (notes: number[]): [number, boolean][] => {
    const seq: [number, boolean][] = [];
    for (let i = 0; i < 12; i++) {
        seq.push([i, notes.includes(i)]);
    }
    return seq.toReversed();
};

interface NoteProps {
    /** How many semitones away from the root is this note */
    noteOffset: number;
}

const Note: React.FC<NoteProps> = ({ noteOffset }) => {
    return <Note_ style={{ marginInlineEnd: `${(12 - noteOffset) * 8}px` }} />;
};

const Note_ = styled.div`
    background-color: var(--mrmr-color-4);

    &:hover {
        background-color: var(--mrmr-color-3);
    }
`;

const Blank: React.FC<NoteProps> = ({ noteOffset }) => {
    return <Blank_ style={{ marginInlineEnd: `${(12 - noteOffset) * 8}px` }} />;
};

const Blank_ = styled.div`
    background-color: var(--mrmr-color-4);

    opacity: 0.2;
`;

const Description: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <div>
            <p>
                Raagas are like scales (not really, they're more like Markov
                chains, but to a first approximation we can think of them as
                scales).
            </p>
            <p>
                {`Above you can see the semitone distance between notes on Raag
                 ${raag.name}. Hover on them to hear how they sound (tap once to
                 enable audio).`}
            </p>
        </div>
    );
};

const TextContent = styled.div`
    background-color: oklch(2% 0 0 / 0.05);
    color: oklch(98% 0 0);
    padding-inline: 1rem;
    padding-block: 0.2rem;
    border-radius: 3px;
`;
