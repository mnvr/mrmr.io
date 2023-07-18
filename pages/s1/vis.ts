// @ts-nocheck
import type { HydraVis } from "types";

export const vis: HydraVis = ({ h }) => {
    h.osc().aspect().out();
};
