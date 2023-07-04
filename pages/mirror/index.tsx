import { FooterA } from "components/FooterA";
import { PlayerP5 } from "components/PlayerP5";
import * as React from "react";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    return (
        <div>
            <PlayerP5 draw={draw} />
            <FooterA />
        </div>
    );
};
