// @ts-nocheck
import HydraRenderer from "hydra-synth";

export const vis = ({ synth: h }: HydraRenderer) => {
    h.osc(6.28 * 3, 0).out();
};
