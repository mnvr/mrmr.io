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
            <p>{`The ladder above shows the distance between notes that form
                raag ${raag.name} – Hover on them to hear how they sound (you'll
                need to tap once to enable audio)`}</p>
            <p>
                Compared to the Bhairav raag that we looked at earlier, raag
                Yaman is simpler. Both to play, and how it sounds. It has a more
                pleasant vibe, while Bhairav had a sharp breathtaking jump in
                the middle
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
                Raags can be played on any instrument. For example, here it is
                on a guitar, starting with the highlighted note (the A on the
                first string)
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
                We can begin with any note we want, all we need to do is ensure
                successive notes have the following distance between them
            </p>
        </div>
    );
};

const FretboardDescription2: React.FC = () => {
    return (
        <div>
            <p>
                You can see this, and two more things, in the fretboard below:
                (a) picking a different root note, the D on the second string,
                (b) counting beyond 11 (the raag repeats), and (c) counting
                backwards from the root note
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
                Instead, take raags as creative strategies to provide you with
                inspiration when you feel in a musical rut.
            </p>
        </End_>
    );
};

const End_ = styled.div`
    margin-block-start: 2em;
`;
