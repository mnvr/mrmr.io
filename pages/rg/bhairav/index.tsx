import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <WideColumn>
            <Title>
                <T1>ra'g</T1> bhairav
            </Title>
            <Raga />
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

const Raga: React.FC = () => {
    const notes = [0, 1, 4, 5, 7, 8, 11];
    return (
        <Raga_>
            {noteSequence(notes).map(([i, isOn]) =>
                isOn ? (
                    <Note key={i} noteOffset={i} />
                ) : (
                    <Blank key={i} noteOffset={i} />
                ),
            )}
        </Raga_>
    );
};

const Raga_ = styled.div`
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
        /* Ask the flexbox to grow all the items equally along the main axis */
        /* flex-grow: 1; */
        /* Don't let anything shrink */
        flex-shrink: 0;
        /* Give all the items some minimum height */
        flex-basis: 3px;
        border-radius: 3px;
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
    /**
     * The note offset of this note from the root note of the raag
     *
     * This is the number of semitones from the tonic (root).
     */
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
