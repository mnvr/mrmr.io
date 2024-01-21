import { IconButton } from "components/Buttons";
import { WideColumn } from "components/Column";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import styled from "styled-components";
import { ensure } from "utils/ensure";
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
                <RaagLadder synth={synth.current} raag={raag} />
                <Description raag={raag} />
                <Description2 raag={raag} />
                <RaagPlayer synth={synth.current} raag={raag} />
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

const RaagLadder: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    const seq = () => noteSequence(raag.notes).reverse();
    return (
        <RaagLadder_>
            {seq().map(([i, isNoteOnRaag]) =>
                isNoteOnRaag ? (
                    <LadderNote key={i} synth={synth} noteOffset={i} />
                ) : (
                    <LadderBlank key={i} noteOffset={i} />
                ),
            )}
        </RaagLadder_>
    );
};

const RaagLadder_ = styled.div`
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

const Description: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <Description_>
            <p>
                Raagas are like scales (<i>not really</i>, they're more like
                Markov chains, but thinking of them as scales is a good first
                approximation)
            </p>
            <p>
                {`Above you can see the distance between notes on Raag
                ${raag.name} – Hover on them to hear how they sound (tap once to
                 enable audio)`}
            </p>
        </Description_>
    );
};

const Description_ = styled.div`
    padding-block: 1px;
`;

const Description2: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <Description2_>
            <p>Here is an unending rendition of it </p>
        </Description2_>
    );
};

const Description2_ = styled.div`
    margin-block-start: 3rem;
    /* border: 1px solid tomato; */
    display: flex;
    flex-direction: column;
`;

const RaagPlayer: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    // True if we're currently playing
    const [isPlaying, setIsPlaying] = React.useState(false);

    // The index of the note that we're currently playing. Only valid when
    // isPlaying is `true`.
    const [noteIndex, setNoteIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(1);

    const [scheduledIntervalId, setScheduledIntervalId] = React.useState<
        number | undefined
    >(undefined);

    const [scheduledTimerId, setScheduledTimerId] = React.useState<
        number | undefined
    >(undefined);

    console.log("rendering RaagPlayer", { noteIndex, direction, isPlaying });

    // The number of octaves we span in our player
    const octaves = 1;
    // Create `octave` copies of the notes in the raag, each offset by 12.
    let notes: Array<number> = [];
    for (let oct = 0; oct < octaves; oct++) {
        notes.push(...raag.notes.map((n) => n + 12 * oct));
    }

    /**
     * Use random brownian motion to determine the next note, ensuring that we
     * stay within the range of notes we're visualizing
     */
    const nextNote = (ni: number, dir: number) => {
        // const coin = Math.random() > 0.8;
        // let i;
        // if (noteIndex === notes.length - 1) {
        //     if (coin) {
        //         i = noteIndex - 2;
        //     } else {
        //         i = noteIndex - 1;
        //     }
        // } else if (noteIndex === 0) {
        //     if (coin) {
        //         i = 2;
        //     } else {
        //         i = 1;
        //     }
        // } else {
        //     if (coin) {
        //         i = noteIndex + 1;
        //     } else {
        //         i = noteIndex - 1;
        //     }
        // }
        // console.log(coin, noteIndex, i, notes[i], notes.length);
        console.log(ni);
        synth.play({ note: 69 + ensure(notes[ni ?? 0]) });
        // setNoteIndex(i);

        // const j = Math.floor(Math.random() * (notes.length + 4));
        let j = ni + (dir ?? 1);
        if (j === notes.length) {
            setDirection(-1);
            dir = -1;
            j = notes.length - 2;
        } else if (j < 0) {
            setDirection(1);
            dir = 1;
            j = 0;
        }
        const nj = j < notes.length ? notes[j] : undefined;
        if (nj) {
            // synth.play({ note: 69 + nj });
            // const l = 0.1 + Math.random() * 0.3;
            // synth.play({
            //     note: 69 + nj,
            //     duration: 0.14,
            //     level: l,
            //     env: { release: 0.08 },
            // });
        }
        console.log("nextNote", { j, nj, ni, direction });
        setNoteIndex((k) => {
            console.log("within setNoteIndex", { k, j });
            return j;
        });

        const tid = window.setTimeout(() => {
            nextNote(j, dir);
        }, 800);
        setScheduledTimerId(tid);
    };

    const handleClick = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setNoteIndex(0);
            setDirection(1);
            clearInterval(scheduledIntervalId);
            setScheduledIntervalId(undefined);
            clearTimeout(scheduledTimerId);
            setScheduledTimerId(undefined);
        } else {
            setIsPlaying(true);
            nextNote(noteIndex, direction);
            // setNoteIndex(0);
            // setDirection(1);
            // synth.play({ note: 69 + noteIndex });
            const interval = window.setInterval(() => {
                // nextNote();
            }, 240);
            setScheduledIntervalId(interval);
        }
    };

    const noteOffsetToPlay = isPlaying ? notes[noteIndex] : undefined;

    return (
        <RaagPlayer_>
            <IconButton onClick={handleClick}>
                {isPlaying ? (
                    <BsPauseFill title="Pause" />
                ) : (
                    <BsPlayFill title="Play" />
                )}
            </IconButton>
            <RaagPlayerNotes {...{ synth, raag, octaves, noteOffsetToPlay }} />
        </RaagPlayer_>
    );
};

const RaagPlayer_ = styled.div`
    margin-block-start: 1.05em;
    margin-block-end: 3em;

    display: flex;
    flex-direction: column;
    align-items: center;

    button {
        font-size: 2em;

        color: var(--mrmr-color-3);
        opacity: 0.9;
    }

    button:hover {
        color: var(--mrmr-color-2);
    }

    gap: 2em;
`;

type RaagPlayerNotesProps = PropsWithSynthAndRaag & {
    octaves: number;
    noteOffsetToPlay?: number;
};

const RaagPlayerNotes: React.FC<RaagPlayerNotesProps> = ({
    synth,
    raag,
    octaves,
    noteOffsetToPlay,
}) => {
    console.log("rendering RaagPlayerNotes", { octaves, noteOffsetToPlay });

    const seq = () => noteSequence(raag.notes, octaves);
    return (
        <RaagPlayerNotes_>
            {seq().map(([i, isNoteOnRaag]) =>
                isNoteOnRaag ? (
                    <RPNote
                        key={i}
                        synth={synth}
                        noteOffset={i}
                        isPlaying={i === noteOffsetToPlay}
                    />
                ) : (
                    <RPBlank key={i} />
                ),
            )}
        </RaagPlayerNotes_>
    );
};

const RaagPlayerNotes_ = styled.div`
    /* A bit of pixel tweaking to try and get the left side of the raga notes to
       look vertically aligned with the text above it */
    margin-inline: 3px;

    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    & > div {
        width: 12px;
        height: 30px;
        border-radius: 3px;
    }
`;

type RPNoteProps = NoteProps & {
    isPlaying: boolean;
};

const RPNote: React.FC<RPNoteProps> = ({ synth, noteOffset, isPlaying }) => {
    // True if this note is currently being played because of a user action.
    const [wasTriggered, setWasTriggered] = React.useState(false);

    const playNote = () => {
        setWasTriggered(true);
        synth.play({ note: 69 + noteOffset }, () => setWasTriggered(false));
    };

    const handleClick = () => {
        playNote();
    };

    const handleMouseEnter = () => {
        if (isMobile) return;
        if (synth.canAutoplay) playNote();
    };

    return (
        <Note_
            $isPlaying={isPlaying || wasTriggered}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        />
    );
};

const RPBlank: React.FC = () => {
    return <Blank_ />;
};
