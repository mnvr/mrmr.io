// @ts-nocheck
import HydraRenderer from "hydra-synth";

export const vis = ({ synth: h }: HydraRenderer) => {
    h.hsl(248.2 / 360, 0.991, 0.555)
        .add(h.osc())
        .rotate(() => Math.sin(h.time * 0.1))
        .aspect()
        .out();
};
