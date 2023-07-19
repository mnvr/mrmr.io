import { PlayerHydraStrudel } from "components/PlayerHydraStrudel";
import * as React from "react";
import { song } from "./song";
import { vis } from "./vis";

export const Content: React.FC = () => {
    return <PlayerHydraStrudel vis={vis} song={song} />;
};
