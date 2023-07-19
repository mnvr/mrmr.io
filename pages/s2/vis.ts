// @ts-nocheck
import type { HydraVis } from "types";

export const vis: HydraVis = ({ h }) => {
    h.osc(60)
        // .rotate(({time}) => Math.abs(Math.sin(time) * 0.01))
        .kaleid(3)
        .color(3)
        .aspect()
        .out();
};
