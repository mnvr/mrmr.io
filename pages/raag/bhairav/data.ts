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
    fretboard1: FretboardStrings;
    fretboardMarks: FretboardMarks;
}

/** One octave of raag Bhairav starting at A2 */
const fretboardStringsRBA2: FretboardStrings = [
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    [
        undefined,
        undefined,
        undefined,
        11,
        undefined,
        undefined,
        undefined,
        undefined,
    ],
    [undefined, undefined, 5, undefined, 7, 8, undefined, undefined],
    [undefined, undefined, 0, 1, undefined, undefined, 4, undefined],
];

const raagFretboardStringsC: FretboardStrings = [
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    [
        undefined,
        undefined,
        undefined,
        11,
        undefined,
        undefined,
        undefined,
        undefined,
    ],
    [undefined, 5, undefined, 7, 8, undefined, undefined, undefined],
    [undefined, undefined, 0, 1, undefined, undefined, 4, undefined],
];

export const raagBhairav: Raag = {
    name: "Bhairav",
    nameInDevanagri: "भैरव",
    notes: [0, 1, 4, 5, 7, 8, 11],
    fretboard1: fretboardStringsRBA2,
    fretboardMarks: standardFretboardMarks,
};
