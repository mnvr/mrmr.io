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
    name: "bhairav",
    notes: [0, 1, 4, 5, 7, 8, 11],
};

export const Content: React.FC = () => {
    return <RaagContent raag={raagBhairav} />;
};

interface RaagProps {
    raag: Raag;
}

export const RaagContent: React.FC<RaagProps> = ({ raag }) => {
    return (
        <WideColumn>
            <Title>
                <T1>ra'g</T1> {raag.name}
            </Title>
            <Raag raag={raag} />
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

const Raag: React.FC<RaagProps> = ({ raag }) => {
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
