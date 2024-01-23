import * as React from "react";
import styled from "styled-components";
import { raagBhairav } from "../raag";
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
            <RaagContent synth={synth.current} raag={raagBhairav} />
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
            <p>
                Raags are like scales (<i>not really</i>, but it's a good first
                approximation)
            </p>
            <p>
                {`Above you can see the distance between notes on raag
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

const End: React.FC = () => {
    return (
        <End_>
            <p>
                You can play it on any instrument, acoustic or electronic,
                analog or digital. Or if there are no instrument lying around,
                you can sing it too
            </p>
            <p>
                Remember, raags are not a recipe but an invitation to create
                music
            </p>
        </End_>
    );
};

const End_ = styled.div`
    margin-block-start: 2em;
`;
