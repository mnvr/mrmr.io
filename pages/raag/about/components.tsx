import * as React from "react";
import styled from "styled-components";

export const Notes = styled.div`
    margin-left: 1em;
    font-style: italic;
`;

interface HighlightedNotesProps {
    /** The indicies of the notes to highlight */
    highlighted: Array<number>;
}

// export const HighlightedNotes =

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
                <Row key={i}>
                    {row.map((note, i) =>
                        note[1] === "#" ? (
                            <div key={i}>
                                <span>{note[0]}</span>
                                <span>
                                    <sup>#</sup>
                                </span>
                            </div>
                        ) : (
                            <div key={i}>{note}</div>
                        ),
                    )}
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
    max-width: 400px;
    justify-content: space-between;

    & > div {
        flex-grow: 1;
        flex-basis: 20px;

        display: flex;

        sup {
            color: var(--mrmr-color-3);
        }
    }
`;
