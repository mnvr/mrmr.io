import * as React from "react";
import styled from "styled-components";

export const Notes = styled.div`
    margin-left: 1em;
    font-style: italic;

    .muted {
        color: var(--mrmr-color-3);
    }
`;

export const BhairavNotes: React.FC = () => {
    const notes = sargam.split(" ");
    return (
        <Notes>
            {notes.map((note, i) => (
                <span
                    key={i}
                    className={bhairavNotes.includes(i) ? "" : "muted"}
                >
                    {`${note} `}
                </span>
            ))}
        </Notes>
    );
};

const bhairavNotes = [0, 1, 4, 5, 7, 8, 11];

const sargam = "S r R g G m M P d D n N";
const westernNotes = "A A# B C C# D D# E F F# G G#";
const intervals = Array(12)
    .fill(0)
    .map((_, i) => `${i}`);

export const Mapping1: React.FC = () => {
    return <Mapping rows={[sargam, westernNotes]} />;
};

export const Mapping2: React.FC = () => {
    return <Mapping rows={[sargam, westernNotes, intervals]} />;
};

interface MappingProps {
    /**
     * Rows of notes
     *
     * Each row can be specified as a string, in which case it is split by words
     * to obtain the notes, or it can be directly provided as an array of notes.
     *
     * The third row, if present, is taken to be a row of numbers and styled
     * differently.
     */
    rows: Array<string | Array<string>>;
    /** The indicies of the notes in each row to highlight */
    highlighted?: Array<number>;
}

const Mapping: React.FC<MappingProps> = ({ rows, highlighted }) => {
    const nrows = rows.map((row) =>
        Array.isArray(row) ? row : row.split(" "),
    );

    return (
        <Mapping_>
            {nrows.map((row, i) => (
                <Row key={i} className={i === 2 ? "nums" : ""}>
                    {row.map((note, i) => (
                        <div key={i}>
                            {note[1] === "#" ? (
                                <>
                                    <span>{note[0]}</span>
                                    <span>
                                        <sup>#</sup>
                                    </span>
                                </>
                            ) : (
                                <span>{note}</span>
                            )}
                        </div>
                    ))}
                </Row>
            ))}
        </Mapping_>
    );
};

const Mapping_ = styled.div`
    @media (min-width: 400px) {
        margin-inline: 1em;
    }

    font-style: italic;

    display: flex;
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    max-width: 320px;

    & > div {
        flex-grow: 1;
        flex-basis: 1px;

        display: flex;

        sup {
            color: var(--mrmr-color-3);
        }
    }

    &.nums {
        font-size: 0.9em;
    }
`;
