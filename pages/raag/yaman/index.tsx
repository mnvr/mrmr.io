import * as React from "react";
import styled from "styled-components";
import { raagYaman } from "../raag";
import {
    Fretboard1,
    Fretboard2,
    Intervals,
    Ladder,
    Piano,
    RaagColumn,
    RaagName,
    type PropsWithRaag,
    type PropsWithSynthAndRaag,
} from "../raag-components";
import { Synth } from "../synth";

export const Content: React.FC = () => {
    const synth = React.useRef(new Synth());

    React.useEffect(() => {
        const handleClick = () => synth.current.init();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <RaagColumn>
            <RaagContent synth={synth.current} raag={raagYaman} />
        </RaagColumn>
    );
};

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
        </>
    );
};

const LadderDescription: React.FC<PropsWithRaag> = ({ raag }) => {
    return (
        <LadderDescription_>
            <p>Raags are like scales, kind of.</p>
            <p>
                {`The ladder above shows the distance between notes that form Raag
                ${raag.name} – Hover on them to hear how they sound (You'll need to tap once to
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
            <p>
                Raags can be played on any instrument. For example, we can play
                it on a guitar
            </p>
        </FretboardDescription_>
    );
};

const FretboardDescription_ = styled.div`
    margin-block-start: 3em;
`;

const IntervalDescription: React.FC = () => {
    return (
        <div>
            <p>
                The fretboard shows the raag if we begin with the A note
                (highlighted) on the first string
            </p>
            <p>But we can begin with any note we want.</p>
        </div>
    );
};

const FretboardDescription2: React.FC = () => {
    return (
        <div>
            <p>
                Here we pick a different root note, and also continue counting
                beyond 11 - the raag starts to repeat. We can also count
                backwards from the root note.
            </p>
        </div>
    );
};

const PianoDescription: React.FC = () => {
    return (
        <PianoDescription_>
            <p>We can play it on a piano too</p>
        </PianoDescription_>
    );
};

const PianoDescription_ = styled.div`
    margin-block-start: 4em;
`;

const End: React.FC = () => {
    return (
        <End_>
            <p>
                Sometimes folks think of raags as restrictive, rote. But that's
                if you grind them.
            </p>
            <p>
                Instead, you can take raags as creative strategies to provide
                you with inspiration when you feel in a musical rut.
            </p>
        </End_>
    );
};

const End_ = styled.div`
    margin-block-start: 2em;
`;
