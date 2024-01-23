import * as React from "react";
import styled from "styled-components";

export const Sargam: React.FC = () => {
    return <Notes>Sa Re Ga Ma Pa Dha Ni</Notes>;
};

export const Notes = styled.div`
    margin-left: 1em;
    font-style: italic;
`;

export const Sargam12: React.FC = () => {
    return <Notes>Sa Re Ga Ma Pa Dha Ni</Notes>;
};

export const Mapping: React.FC = () => {
    const iNotes = "S r R g G m M P d D n N".split(" ");
    const wNotes = "A A# B C C# D D# E F F# G G#".split(" ");
    return (
        <Notes>
            <Mapping_>
                <Row>
                    {iNotes.map((note, i) => (
                        <div key={i}>{note}</div>
                    ))}
                </Row>
                <Row>
                    {wNotes.map((note, i) =>
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
            </Mapping_>
        </Notes>
    );
};

const Mapping_ = styled.div`
    display: flex;
    flex-direction: column;
    /* border: 1px solid tan; */

    /* font-family: monospace; */
`;

const Row = styled.div`
    display: flex;
    max-width: 400px;
    justify-content: space-between;
    /* gap: 1px; */
    /* background-color: tan; */

    & > div {
        flex-grow: 1;
        flex-basis: 20px;
        background-color: var(--mrmr-background-color-1);

        display: flex;
        border: 1px solid tomato;

        sup {
            color: var(--mrmr-color-3);
        }
    }
`;
