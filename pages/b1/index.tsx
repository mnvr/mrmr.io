import { P5Layout } from "layouts/p5";
import * as React from "react";
import { draw } from "./sketch";

export const Content: React.FC = () => {
    return (
        <div>
            <P5Layout draw={draw} />
        </div>
    );
};
