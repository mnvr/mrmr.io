import { IconButton } from "components/Buttons";
import { WideColumn } from "components/Column";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
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

const RaagPlayer: React.FC<PropsWithSynthAndRaag> = (props) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <RaagPlayer_>
            <IconButton onClick={handleClick}>
                {isPlaying ? (
                    <BsPauseFill title="Pause" />
                ) : (
                    <BsPlayFill title="Play" />
                )}
            </IconButton>
            <RaagPlayerNotes {...props} />
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

const RaagPlayerNotes: React.FC<PropsWithSynthAndRaag> = ({ synth, raag }) => {
    const seq = () => noteSequence(raag.notes, 2);
    return (
        <RaagPlayerNotes_>
            {seq().map(([i, isNoteOnRaag]) =>
                isNoteOnRaag ? (
                    <RPNote key={i} synth={synth} noteOffset={i} />
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

const RPNote: React.FC<NoteProps> = ({ synth, noteOffset }) => {
    // true if this note is currently being played.
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
        <Note_
            $isPlaying={isPlaying}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
        />
    );
};

const RPBlank: React.FC = () => {
    return <Blank_ />;
};
