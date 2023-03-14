// @ts-nocheck
import type { HydraVis } from "types";

export const vis: HydraVis = ({ h }) => {
    h.hsl(248.2 / 360, 0.991, 0.555)
        .add(h.osc())
        .rotate(() => Math.sin(h.time * 0.1))
        .aspect()
        .out();
};
