import * as React from "react";
import styled from "styled-components";

export const Poem: React.FC = () => {
    return (
        <section>
            <p>
                <i>Solaris</i>
                <br />
                <Line>Can't touch me</Line>
                <Line>Can hit me</Line>
                <Line>Can't hurt me</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>Meet Mimir</Line>
                <Line>Another dawn</Line>
                <Line>We watch</Line>
                <Line>Moving on</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>Why the distaste</Line>
                <Line>Why the hate</Line>
                <Line>They are what they are</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>They didn't choose to be</Line>
                <Line>Blind brutal</Line>
                <Line>Eternity</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>Drenched in your light</Line>
                <Line>Everything is all right</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>Time breaks me down</Line>
                <Line>In time I cease to be, yet</Line>
                <Line>Time is my testimony</Line>
            </p>
            <p>
                Solaris
                <br />
                <Line>Cold dark mountain</Line>
                <Line>Making me bleed</Line>
                <Line>Float, and be free</Line>
            </p>
            <p>
                <i>Solaris</i>
            </p>
            <br />
        </section>
    );
};
const Line: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Line_>
            <>
                {children}
                <br />
            </>
        </Line_>
    );
};

const Line_ = styled.span`
    padding-inline: 0.7rem;
`;
