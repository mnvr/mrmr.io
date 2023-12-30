import { ExternalLinkWithIcon } from "components/ExternalLink";
import * as React from "react";
import * as C from "./components";
import { sketch } from "./sketch";

export const Content: React.FC = () => {
    return (
        <C.Content sketch={sketch}>
            <Description />
        </C.Content>
    );
};

const Description: React.FC = () => {
    return (
        <C.Description>
            <p>
                Genuary is an month-long online art fair (that's one way of
                putting it!) that happens every year, in, you guessed it,
                January. This year I thought I'll do remixes of the other
                Genuary art that I come across and find particularly inspiring.
            </p>
            <p>
                Additionally, I've constrained myself to use only grids. So this
                is like a Griduary too.
            </p>
            <p>
                I'm using p5.js to make these sketches, and the{" "}
                <ExternalLinkWithIcon href="https://github.com/mnvr/mrmr.io/tree/main/pages/gen24">
                    source code for all of these is available on GitHub
                </ExternalLinkWithIcon>
                . The one you see above is not a remix, it is a cover I made to
                kickstart things off.{" "}
                {/*The remixes are below. Tap on any of them
                to view a live version.*/}
            </p>
            <p>Have a great and inspiring 2024.</p>
        </C.Description>
    );
};
