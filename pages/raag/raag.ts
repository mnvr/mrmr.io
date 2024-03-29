/**
 * A string on a fretboard, with:
 *
 * - Numeric values indicating frets that belong to the raag. The number is the
 *   noteOffset from the root note;
 *
 * - `undefined` values indicating frets that are not part of the raag.
 */
export type FretboardStringNotes = Array<number | undefined>;

/**
 * The six strings that form a guitar fretboard.
 *
 * To limit the width of the fretboard (so that it fits even on small sized
 * mobile screens), only a relevant range of the fretboard is shown: Each string
 * starts from fret 3 and continues till fret 10 (inclusive).
 */
export type FretboardStrings = Array<FretboardStringNotes>;

/**
 * Marks alongside the strings on a fretboard to easily identify the fret.
 */
export type FretboardMarks = Array<boolean>;

/**
 * Markings on the fretboard, same as what guitars usually have.
 *
 * This spans the same range as {@link raagFretboardStrings}, i.e. it starts
 * from fret 3 and goes on till fret 10 (inclusive).
 */
const standardFretboardMarks: FretboardMarks = [1, 0, 1, 0, 1, 0, 1, 0].map(
    (i) => i === 1,
);

/* More like Thaat, but let's live with this for now */
export interface Raag {
    name: string;
    nameInDevanagri: string;
    /** This is the number of semitones from the root note (the Sa). */
    notes: number[];
    ladderRootNote: number;
    fretboardMarks: FretboardMarks;
    fretboard1: FretboardStrings;
    fretboard1RootNote: number;
    fretboard2: FretboardStrings;
    fretboard2RootNote: number;
    /**
     * The piano illustration currently has a hardcoded 11 keys beginning at C,
     * so this should be a MIDI note corresponding to some C
     */
    pianoRootNote: number;
}

/** A convenience alias */
const na = undefined;

/** One octave of raag Bhairav starting at A2 */
const fretboard1BhairavA2: FretboardStrings = [
    Array(8).fill(na),
    Array(8).fill(na),
    Array(8).fill(na),
    [na, na, na, 11, na, na, na, na],
    [na, na, 5, na, 7, 8, na, na],
    [na, na, 0, 1, na, na, 4, na],
];

/** Multiple octaves of raag Bhairav rooted at D2 */
const fretboard2BhairavD2Ex: FretboardStrings = [
    [na, na, 19, 20, na, na, 23, 24],
    [na, na, na, na, 16, 17, na, na],
    [na, na, na, 11, 12, 13, na, na],
    [na, na, 5, na, 7, 8, na, na],
    [na, -1, 0, 1, na, na, 4, na],
    [na, -6, -5, -4, na, na, na, na],
];

export const raagBhairav: Raag = {
    name: "Bhairav",
    nameInDevanagri: "भैरव",
    notes: [0, 1, 4, 5, 7, 8, 11],
    ladderRootNote: 69,
    fretboard1: fretboard1BhairavA2,
    // Even though the scale starts at A2 (MIDI 45), that frequency is too low
    // for the synth we're using, so we use the A that's two octaves up. This
    // has the additional advantage that our fretboard matches the ladder.
    fretboard1RootNote: 69,
    fretboardMarks: standardFretboardMarks,
    fretboard2: fretboard2BhairavD2Ex,
    fretboard2RootNote: 74,
    pianoRootNote: 60,
};

/** One octave of raag Yaman starting at A2 */
const fretboard1YamanA2: FretboardStrings = [
    Array(8).fill(na),
    Array(8).fill(na),
    Array(8).fill(na),
    [na, 9, na, 11, na, na, na, na],
    [na, 4, na, 6, 7, na, na, na],
    [na, na, 0, na, 2, na, na, na],
];

/** Multiple octaves of raag Yaman rooted at D2 */
const fretboard2YamanD2Ex: FretboardStrings = [
    [na, 18, 19, na, 21, na, 23, 24],
    [na, na, 14, na, 16, na, na, na],
    [na, 9, na, 11, 12, na, na, na],
    [na, 4, na, 6, 7, na, na, na],
    [na, -1, 0, na, 2, na, na, na],
    [na, -6, -5, na, -3, na, na, na],
];

export const raagYaman: Raag = {
    name: "Yaman",
    nameInDevanagri: "यमन",
    notes: [0, 2, 4, 6, 7, 9, 11],
    ladderRootNote: 69,
    fretboard1: fretboard1YamanA2,
    fretboard1RootNote: 69,
    fretboardMarks: standardFretboardMarks,
    fretboard2: fretboard2YamanD2Ex,
    fretboard2RootNote: 74,
    pianoRootNote: 60,
};
