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
    const notes = [0, 1, 3, 5, 7, 9, 11];
    return (
        <Raga_>
            {noteSequence(notes).map(([i, isOn]) =>
                isOn ? <Note key={i} noteOffset={i} /> : <div key={i} />,
            )}
        </Raga_>
    );
};

const Raga_ = styled.div`
    border: 1px solid tomato;
    min-height: 80svh;
    display: flex;
    flex-direction: column;

    & > div {
        width: min(17rem, 100%);
        border: 1px dotted blue;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 1rem;
    }
`;

const noteSequence = (notes: number[]): [number, boolean][] => {
    const seq: [number, boolean][] = [];
    for (let i = 0; i < 12; i++) {
        seq.push([i, notes.includes(i)]);
    }
    return seq;
};

interface NoteProps {
    /** The note offset of this note from the root note of the raag */
    noteOffset: number;
}

const Note: React.FC<NoteProps> = ({ noteOffset }) => {
    return (
        <Note_>
            <div>{noteOffset}</div>
        </Note_>
    );
};

const Note_ = styled.div`
    background-color: var(--mrmr-color-4);
`;
