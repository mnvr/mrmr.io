import { registerSynthSounds } from "@strudel/webaudio";
import { ensure } from "utils/ensure";
import { inspect } from "./inspect";

/**
 * Perform commonly used initialization actions.
 */
export const initStrudel = () => {
    // Refer to the inspect function so that it gets registered.
    ensure(inspect != undefined);
    registerSynthSounds();
};
