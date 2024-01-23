import { WideColumn } from "components/Column";
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
} from "./data";
import { raagBhairav } from "./data";
import { Synth } from "./synth";

export const Content: React.FC = () => {
    return <RaagColumn raag={raagBhairav} />;
};

interface PropsWithRaag {
    raag: Raag;
}

interface PropsWithSynthAndRaag {
    synth: Synth;
    raag: Raag;
}

export const RaagColumn: React.FC<PropsWithRaag> = ({ raag }) => {
    const synth = React.useRef(new Synth());

    React.useEffect(() => {
        const handleClick = () => synth.current.init();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <RaagColumn_>
            <WideColumn>
                <RaagContent synth={synth.current} raag={raag} />
            </WideColumn>
        </RaagColumn_>
    );
};

const RaagColumn_ = styled.div`
    /* Use a large font as the base */
    font-size: 22px;
`;

const RaagContent: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    return (
        <>
            <RaagName raag={raag} />
            <Ladder synth={synth} raag={raag} />
            <LadderDescription raag={raag} />
            <FretboardDescription />
            <Fretboard1 synth={synth} raag={raag} />
            <IntervalDescription />
            <Intervals synth={synth} raag={raag} />
            <FretboardDescription2 />
            <Fretboard2 synth={synth} raag={raag} />
            <PianoDescription />
            <Piano synth={synth} raag={raag} />
            <End />
            <Footer />
        </>
    );
};

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
    const rootNote = raag.ladderRootNote;
    const seq = () => noteSequence(raag.notes).reverse();
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
            style={{ marginInlineEnd: `${(12 - noteOffset) * 8}px` }}
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
            <p>You can play it on a guitar</p>
        </FretboardDescription_>
    );
};

const FretboardDescription_ = styled.div`
    margin-block-start: 3em;
`;

const Fretboard1: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
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

const IntervalDescription: React.FC = () => {
    return (
        <div>
            <p>
                The fretboard shows the raag if we begin with the A note
                (highlighted) on the first string
            </p>
            <p>
                But we can begin with any note we want, all we need to do is
                maintain the distance between notes
            </p>
        </div>
    );
};

const Intervals: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
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

const FretboardDescription2: React.FC = () => {
    return (
        <div>
            <p>
                So pick any note. Count as you proceed. If the number you
                counted is on this list, then that note belongs to the raag
            </p>
            <p>
                For example, here's the raag if we use the D on the second
                string as our root note. Notice how we can also count backwards,
                and how we can keep counting even after 11 - the raag repeats
            </p>
        </div>
    );
};

const Fretboard2: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    return (
        <Fretboard
            fretboard={raag.fretboard2}
            rootNote={raag.fretboard2RootNote}
            {...{ synth, raag }}
        />
    );
};

const PianoDescription: React.FC = () => {
    return (
        <PianoDescription_>
            <p>You can play it on a piano</p>
        </PianoDescription_>
    );
};

const PianoDescription_ = styled.div`
    margin-block-start: 4em;
`;

const Piano: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
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
                        className={`on ${className}`}
                        synth={synth}
                        rootNote={raag.pianoRootNote}
                        noteOffset={i}
                    />
                ) : (
                    <div className={`off ${className}`} />
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

const End: React.FC = () => {
    return (
        <End_>
            <p>
                You can play it on any instrument, acoustic or electronic,
                analog or digital. Or if there are no instrument lying around,
                you can sing it too
            </p>
            <p>
                Remember, raags are not a recipe, but an invitation, to make
                music
            </p>
        </End_>
    );
};

const End_ = styled.div`
    margin-block-start: 2em;
`;

const Footer: React.FC = () => {
    return (
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

        text-decoration: none;
        font-weight: 500;

        svg {
            width: 12px;
            height: 12px;
            vertical-align: middle;
            margin-block-end: 3px;
            margin-inline: 4px;
        }
    }

    a:hover {
        background-color: hsl(60, 100%, 85%);
        color: oklch(40% 0 0);
        @media (prefers-color-scheme: dark) {
            background-color: yellow;
            color: oklch(20% 0 0);
        }
    }
`;
