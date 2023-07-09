import { FooterA } from "components/FooterA";
import { PlayerP5WebAudio } from "components/PlayerP5WebAudio";
import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { onlyValue } from "utils/object";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { mp3s } = page;

    return (
        <div>
            <PlayerP5WebAudio draw={draw} songURL={ensure(onlyValue(mp3s))} />
            <FooterA />
        </div>
    );
};
