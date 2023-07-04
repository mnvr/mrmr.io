import { FooterA } from "components/FooterA";
import { PlayerP5WebAudio } from "components/PlayerP5WebAudio";
import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { mp3s } = page;

    return (
        <div>
            <PlayerP5WebAudio draw={draw} songURL={ensure(mp3s["w1"])} />
            <FooterA />
        </div>
    );
};
