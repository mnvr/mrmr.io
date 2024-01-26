import { WideColumn } from "components/Column";
import { LinkStyleBoldHover } from "components/LinkStyles";
import { Link } from "gatsby";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { FaChevronRight } from "react-icons/fa6";
import styled from "styled-components";
import type {
    FretboardMarks,
    FretboardStringNotes,
    FretboardStrings,
    Raag,
} from "./raag";
import { Synth } from "./synth";

export interface PropsWithRaag {
    raag: Raag;
}

export interface PropsWithSynthAndRaag {
    synth: Synth;
    raag: Raag;
}

export const RaagColumn: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <RaagColumn_>
            <WideColumn>
                {children}
                <Footer />
            </WideColumn>
        </RaagColumn_>
    );
};

const RaagColumn_ = styled.div`
    /* Use a large font as the base */
    font-size: 22px;
`;

export const RaagName: React.FC<PropsWithRaag> = ({ raag }) => {
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

export const Ladder: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    const rootNote = raag.ladderRootNote;
    const seq = () =>
        noteSequence(raag.notes)
            /* Include the next octave so that we also show the last interval */
            .concat([[12, true]])
            .reverse();
    return (
        <Ladder_>
            {seq().map(([i, isNoteOnRaag]) =>
                isNoteOnRaag ? (
                    <LadderNote
                        key={i}
                        synth={synth}
                        rootNote={rootNote}
                        noteOffset={i}
                    />
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
    /** The root MIDI note */
    rootNote: number;
    /** How many semitones away from the root is this note */
    noteOffset: number;
}

const LadderNote: React.FC<NoteProps> = ({ synth, rootNote, noteOffset }) => {
    // `true` if this note is currently being played.
    const [isPlaying, setIsPlaying] = React.useState(false);

    const playNote = () => {
        setIsPlaying(true);
        synth.play({ note: rootNote + noteOffset }, () => setIsPlaying(false));
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
            style={{ marginInlineEnd: `${(13 - noteOffset) * 8}px` }}
        />
    );
};

interface NoteProps_ {
    $isPlaying: boolean;
    $isHighlighted?: boolean;
}

const Note_ = styled.div<NoteProps_>`
    cursor: pointer;

    background-color: ${(props) =>
        props.$isPlaying
            ? "var(--mrmr-color-2)"
            : props.$isHighlighted === true
              ? "darkkhaki"
              : "var(--mrmr-color-3)"};

    &:hover {
        background-color: var(--mrmr-color-2);
    }
`;

interface LadderBlankProps {
    /** @see {@link noteOffset} in {@link NoteProps} */
    noteOffset: number;
}

const LadderBlank: React.FC<LadderBlankProps> = ({ noteOffset }) => {
    return <Blank_ style={{ marginInlineEnd: `${(13 - noteOffset) * 8}px` }} />;
};

const Blank_ = styled.div`
    background-color: var(--mrmr-color-3);

    opacity: 0.2;
`;

export const Fretboard1: React.FC<PropsWithSynthAndRaag> = ({
    synth,
    raag,
}) => {
    return (
        <Fretboard
            fretboard={raag.fretboard1}
            rootNote={raag.fretboard1RootNote}
            {...{ synth, raag }}
        />
    );
};

type FretboardProps = PropsWithSynthAndRaag & {
    fretboard: FretboardStrings;
    rootNote: number;
};

const Fretboard: React.FC<FretboardProps> = ({
    synth,
    raag,
    fretboard,
    rootNote,
}) => {
    return (
        <Fretboard_>
            {fretboard.map((notes, i) => (
                <FretboardString key={i} {...{ synth, rootNote, notes }} />
            ))}
            <FretboardMarking marks={raag.fretboardMarks} />
        </Fretboard_>
    );
};

const Fretboard_ = styled.div`
    margin-block-start: 2em;
    /* The last row of the fretboard are the markers, which have less visual
      weight than the strings. To make the fretboard look visually in the middle
      of the paragraphs of text that precede and succeed it, we need an
      asymmetrical block margin - lesser at the end */
    margin-block-end: 1.1em;

    display: flex;
    flex-direction: column;
    gap: 12px;
`;

interface FretboardStringProps {
    synth: Synth;
    rootNote: number;
    notes: FretboardStringNotes;
}

/** A string on the {@link Fretboard} */
const FretboardString: React.FC<FretboardStringProps> = ({
    synth,
    rootNote,
    notes,
}) => {
    return (
        <FretboardString_>
            {notes.map((noteOffset, i) =>
                noteOffset !== undefined ? (
                    <FretNote key={i} {...{ synth, rootNote, noteOffset }} />
                ) : (
                    <FretBlank key={i} />
                ),
            )}
        </FretboardString_>
    );
};

const FretboardString_ = styled.div`
    display: flex;
    justify-content: center;

    gap: 12px;

    & > div {
        flex-basis: 50px;
        height: 12px;
        border-radius: 3px;
    }
`;

/** A note on a string ({@link FretboardString}) of the {@link Fretboard} */
const FretNote: React.FC<NoteProps> = ({ synth, rootNote, noteOffset }) => {
    // `true` if this note is currently being played.
    const [isPlaying, setIsPlaying] = React.useState(false);

    const playNote = () => {
        setIsPlaying(true);
        synth.play({ note: rootNote + noteOffset }, () => setIsPlaying(false));
    };

    const handleClick = () => {
        playNote();
    };

    const handleMouseEnter = () => {
        // See: [Note: onMouseEnter on touch devices]
        if (isMobile) return;
        if (synth.canAutoplay) playNote();
    };

    const isRootNote = noteOffset === 0;

    return (
        <Note_
            $isPlaying={isPlaying}
            $isHighlighted={isRootNote}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        />
    );
};

const FretBlank: React.FC = () => {
    return <Blank_ />;
};

interface FretboardMarkingProps {
    marks: FretboardMarks;
}

/** Markings on the {@link Fretboard} */
const FretboardMarking: React.FC<FretboardMarkingProps> = ({ marks }) => {
    return (
        <FretboardMarking_>
            {marks.map((isMarked, i) => (
                <div key={i}>{isMarked && <Blank_ />}</div>
            ))}
        </FretboardMarking_>
    );
};

const FretboardMarking_ = styled.div`
    display: flex;
    justify-content: center;

    gap: 12px;

    & > div {
        flex-basis: 50px;
        height: 12px;
        display: flex;
        justify-content: center;
    }

    & > div > div {
        width: 8px;
        height: 8px;
        border-radius: 4px;
    }
`;

export const Intervals: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    const rootNote = raag.ladderRootNote;
    return (
        <Intervals_>
            {raag.notes.map((noteOffset, i) => (
                <Interval key={i} {...{ synth, rootNote, noteOffset }} />
            ))}
        </Intervals_>
    );
};

const Intervals_ = styled.div`
    margin-block: 1em;

    display: flex;
    justify-content: space-evenly;
    max-width: 400px;

    font-size: 44px;
    color: var(--mrmr-color-3);
`;

/** An individual interval */
const Interval: React.FC<NoteProps> = ({ synth, noteOffset }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const playNote = () => {
        setIsPlaying(true);
        synth.play({ note: 69 + noteOffset }, () => setIsPlaying(false));
    };

    const handleClick = () => {
        playNote();
    };

    const handleMouseEnter = () => {
        if (isMobile) return;
        if (synth.canAutoplay) playNote();
    };

    return (
        <Interval_
            $isPlaying={isPlaying}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        >
            {noteOffset}
        </Interval_>
    );
};

const Interval_ = styled.div<NoteProps_>`
    cursor: pointer;

    color: ${(props) =>
        props.$isPlaying ? "var(--mrmr-color-2)" : "var(--mrmr-color-3)"};

    &:hover {
        color: var(--mrmr-color-2);
    }
`;

export const Fretboard2: React.FC<PropsWithSynthAndRaag> = ({
    synth,
    raag,
}) => {
    return (
        <Fretboard
            fretboard={raag.fretboard2}
            rootNote={raag.fretboard2RootNote}
            {...{ synth, raag }}
        />
    );
};

export const Piano: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    // An array of classNames describing the keys of a piano, starting from C
    // and going for one octave.
    const classNames = [
        "major",
        "minor",
        "major",
        "minor",
        "major",
        "major adj",
        "minor",
        "major",
        "minor",
        "major",
        "minor",
        "major",
    ];
    return (
        <Piano_>
            {classNames.map((className, i) =>
                raag.notes.includes(i) ? (
                    <PianoNote
                        key={i}
                        className={`on ${className}`}
                        synth={synth}
                        rootNote={raag.pianoRootNote}
                        noteOffset={i}
                    />
                ) : (
                    <div key={i} className={`off ${className}`} />
                ),
            )}
        </Piano_>
    );
};

const Piano_ = styled.div`
    margin-block-start: 2em;

    padding-inline-start: 20px;

    display: flex;
    justify-content: center;
    gap: 2px;

    & > div {
        border-radius: 3px;

        width: 46px;
        height: 190px;
        margin-left: -16px;
    }

    & > div.adj {
        margin-left: 0px;
    }

    & > div.off {
        background-color: oklch(84.24% 0.006 43.32 / 0.1);
    }

    & > div.on {
        cursor: pointer;
    }

    & > div.minor {
        z-index: 1;
        height: 120px;

        background-color: var(--mrmr-background-color-1);
    }

    & > div.major.on {
        background-color: var(--mrmr-color-3);
        opacity: 0.6;
    }

    & > div.minor.on {
        background-color: oklch(27% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: oklch(22% 0 0);
        }
    }

    & > div.major.on:hover {
        opacity: 1;
    }

    & > div.minor.on:hover {
        background-color: black;
    }
`;

const PianoNote: React.FC<NoteProps & React.HTMLAttributes<HTMLDivElement>> = (
    props,
) => {
    const { synth, rootNote, noteOffset, ...rest } = props;

    const playNote = () => {
        synth.play({ note: rootNote + noteOffset, env: { release: 3 } });
    };

    const handleClick = () => {
        playNote();
    };

    const handleMouseEnter = () => {
        if (isMobile) return;
        if (synth.canAutoplay) playNote();
    };

    return (
        <div onClick={handleClick} onMouseEnter={handleMouseEnter} {...rest} />
    );
};

const Footer: React.FC = () => {
    return (
        <LinkStyleBoldHover>
            <Footer_>
                <li>
                    <Link to={"/raag/about"}>
                        More about raags
                        <FaChevronRight />
                    </Link>
                </li>
                <li>
                    <Link to={"/raag"}>
                        More raags
                        <FaChevronRight />
                    </Link>
                </li>
                <li>
                    <Link to={"/"}>
                        Home
                        <FaChevronRight />
                    </Link>
                </li>
            </Footer_>
        </LinkStyleBoldHover>
    );
};

const Footer_ = styled.ul`
    margin-block: 4em;

    list-style: none;
    padding-inline-start: 0;

    li {
        font-size: 16px;
        line-height: 24px;
        margin-block: 2em;
    }

    a {
        padding-inline-start: 4px;
        padding-block: 3px;
        border-radius: 2px;

        svg {
            width: 12px;
            height: 12px;
            vertical-align: middle;
            margin-block-end: 3px;
            margin-inline: 4px;
        }
    }
`;
