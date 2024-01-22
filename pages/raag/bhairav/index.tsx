import { WideColumn } from "components/Column";
import * as React from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Synth } from "./synth";

/* More like Thaat, but let's live with this for now */
interface Raag {
    name: string;
    nameInDevanagri: string;
    /** This is the number of semitones from the root note (the Sa). */
    notes: number[];
}

const raagBhairav: Raag = {
    name: "Bhairav",
    nameInDevanagri: "भैरव",
    notes: [0, 1, 4, 5, 7, 8, 11],
};

export const Content: React.FC = () => {
    return <RaagContent raag={raagBhairav} />;
};

interface PropsWithRaag {
    raag: Raag;
}

interface PropsWithSynthAndRaag {
    synth: Synth;
    raag: Raag;
}

export const RaagContent: React.FC<PropsWithRaag> = ({ raag }) => {
    const synth = React.useRef(new Synth());

    React.useEffect(() => {
        const handleClick = () => synth.current.init();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <RaagContent_>
            <WideColumn>
                <RaagName raag={raag} />
                <Ladder synth={synth.current} raag={raag} />
                <LadderDescription raag={raag} />
                <FretboardDescription />
                <Fretboard synth={synth.current} raag={raag} />
                <Footer />
            </WideColumn>
        </RaagContent_>
    );
};

const RaagContent_ = styled.div`
    /* Use a large font as the base */
    font-size: 22px;
`;

const RaagName: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <RaagName_>
            <h1>
                <T1>ra'g</T1> {raag.name.toLowerCase()}
            </h1>
            <big>
                <T1>राग</T1> {raag.nameInDevanagri}
            </big>
        </RaagName_>
    );
};

const RaagName_ = styled.div`
    font-family: serif;
    font-style: italic;

    h1 {
        font-size: 2.25em;
        margin-block-end: 0.1em;
    }

    big {
        margin-inline-start: -1px;
    }
`;

const T1 = styled.span`
    color: var(--mrmr-color-3);
`;

const Ladder: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    const seq = () => noteSequence(raag.notes).reverse();
    return (
        <Ladder_>
            {seq().map(([i, isNoteOnRaag]) =>
                isNoteOnRaag ? (
                    <LadderNote key={i} synth={synth} noteOffset={i} />
                ) : (
                    <LadderBlank key={i} noteOffset={i} />
                ),
            )}
        </Ladder_>
    );
};

const Ladder_ = styled.div`
    box-sizing: border-box;
    margin-block-start: -1rem;
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

const noteSequence = (
    notes: number[],
    octaves: number = 1,
): [number, boolean][] => {
    const seq: [number, boolean][] = [];
    for (let i = 0; i < 12 * octaves; i++) {
        seq.push([i, notes.includes(i % 12)]);
    }
    return seq;
};

interface NoteProps {
    synth: Synth;
    /** How many semitones away from the root is this note */
    noteOffset: number;
}

const LadderNote: React.FC<NoteProps> = ({ synth, noteOffset }) => {
    // `true` if this note is currently being played.
    const [isPlaying, setIsPlaying] = React.useState(false);

    const playNote = () => {
        setIsPlaying(true);
        synth.play({ note: 69 + noteOffset }, () => setIsPlaying(false));
    };

    const handleClick = () => {
        playNote();
    };

    const handleMouseEnter = () => {
        // [Note: onMouseEnter on touch devices]
        //
        // On mobile browsers, the touch event causes both the onClick and
        // onMouseEnter events to fire, causing the sound to be played twice.
        // There isn't a hover interaction on mobiles anyways, so we just ignore
        // hover actions when on mobile (to prevent the double playback).
        if (isMobile) return;
        if (synth.canAutoplay) playNote();
    };

    return (
        <Note_
            $isPlaying={isPlaying}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            style={{ marginInlineEnd: `${(12 - noteOffset) * 8}px` }}
        />
    );
};

interface NoteProps_ {
    $isPlaying: boolean;
}

const Note_ = styled.div<NoteProps_>`
    cursor: pointer;

    background-color: ${(props) =>
        props.$isPlaying ? "var(--mrmr-color-2)" : "var(--mrmr-color-3)"};

    &:hover {
        background-color: var(--mrmr-color-2);
    }
`;

interface LadderBlankProps {
    /** @see {@link noteOffset} in {@link NoteProps} */
    noteOffset: number;
}

const LadderBlank: React.FC<LadderBlankProps> = ({ noteOffset }) => {
    return <Blank_ style={{ marginInlineEnd: `${(12 - noteOffset) * 8}px` }} />;
};

const Blank_ = styled.div`
    background-color: var(--mrmr-color-3);

    opacity: 0.2;
`;

const LadderDescription: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <LadderDescription_>
            <p>
                Raags are like scales (<i>not really</i>, they're more like
                Markov chains, but thinking of them as scales is a good first
                approximation)
            </p>
            <p>
                {`Above you can see the distance between notes on Raag
                ${raag.name} – Hover on them to hear how they sound (tap once to
                 enable audio)`}
            </p>
        </LadderDescription_>
    );
};

const LadderDescription_ = styled.div`
    padding-block: 1px;
`;

const FretboardDescription: React.FC = () => {
    return (
        <FretboardDescription_>
            <p>You can play it on the guitar, like this:</p>
        </FretboardDescription_>
    );
};

const FretboardDescription_ = styled.div`
    margin-block-start: 3rem;
    padding-block: 1px;
`;

const Fretboard: React.FC<PropsWithSynthAndRaag> = (props) => {
    return (
        <Fretboard_>
            <FBString {...props} />
        </Fretboard_>
    );
};

const Fretboard_ = styled.div`
    display: flex;
    flex-direction: column;
`;

/** A string on the {@link Fretboard} */
const FBString: React.FC<PropsWithSynthAndRaag> = (props) => {
    const notes = () =>
        Array(9)
            .fill(0)
            .map((_, i) => [i, false]);
    return (
        <FBString_>
            {notes().map(([i, isOn]) => {
                return <FretNote />;
            })}
        </FBString_>
    );
};

const FBString_ = styled.div`
    display: flex;

    gap: 12px;

    & > div {
        flex-basis: 50px;
        height: 12px;
        border-radius: 3px;
    }
`;

/** A note on a string ({@link FBString}) of the {@link Fretboard} */
const FretNote: React.FC = () => {
    return <Note_ $isPlaying={false}></Note_>;
};

const FretNote_ = styled.div`
    width: 30px;
    height: 5px;
    background-color: red;
`;

const Footer: React.FC = () => {
    return (
        <FretboardDescription_>
            <p> </p>
        </FretboardDescription_>
    );
};

const Footer_ = styled.div`
    margin-block-start: 3rem;
`;
