// @ts-nocheck
import HydraRenderer from "hydra-synth";

export const vis = ({ synth: h }: HydraRenderer) => {
    h.shape(4).aspect().out();
};
