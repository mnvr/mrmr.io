import { FooterA } from "components/FooterA";
import { PlayerP5WebAudio } from "components/PlayerP5WebAudio";
import * as React from "react";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    return (
        <>
            <PlayerP5WebAudio draw={draw} songURL="/w1.m4a" />
            <FooterA />
        </>
    );
};
