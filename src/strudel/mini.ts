import { mini } from "@strudel/mini";

/**
 * A tagged template literal that wraps the input strings in `mini(...)`
 *
 * ### Why
 *
 * Strudel comes with a transpiler package that can read Strudel code and
 * automatically wrap (non-single-quoted!) strings with a call to `mini(...)`.
 *
 * The downside for this is that we'll need to put the entire song within a
 * string. To allow us to keep writing Strudel code as regular JavaScript
 * (TypeScript) code without wrapping it in a string, yet make it easy to use
 * mini notation, we define a template literal `m``` that reduces the characters
 * needed to wrap a string in `mini(...)`.
 */
export const m = (strings: TemplateStringsArray, ...args: any) => mini(strings);
