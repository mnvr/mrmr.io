import loadable from "@loadable/component";
import { type SketchProps } from "@p5-wrapper/react";

/**
 * Properties (browser state etc) passed to the Sketch by the the React
 * component that contains it.
 *
 * Note: [Forwarding SketchProps across Loadable Component]
 *
 * These properties are rather sketch specific (these are pretty generic
 * actually, but not all sketches need these). However, since we're using
 * loadable to lazily load the ReactP5Wrapper component, it is simpler to just
 * pass them always.
 *
 * There likely would be a way of making {@link ReactP5WrapperWithFade} take a
 * generic {@link SketchProps}, but I leave that to another day when my
 * Typescript-fu is better.
 */
export type ReactP5WrapperWithFadeSketchProps = SketchProps & {
    /** True if ``@media (prefers-color-scheme: dark)` is true */
    isDarkMode?: boolean;
};

/**
 * A lazily loaded ReactP5Wrapper component from the "@p5-wrapper/react" library
 * that adds a fade animation on first appearance.
 *
 * {@link ReactP5Wrapper} is a client side only loadable-component, which is
 * lazy loaded when the page is rendered on the browser. Unfortunately, this
 * means that there is a perceptible delay on first load. Not so much as to
 * warrant a spinner, but perceptible still.
 *
 * To make it more palatable, this ReactP5WrapperWithFade component adds a
 * fade-in animation when it first appears, so that the transition of the canvas
 * onto the page is less jarring.
 *
 * For more details, See: Note: [Using client-side only code with SSR].
 */
const ReactP5WrapperWithFade = loadable(
    () => import("./ReactP5WrapperWithFadeImpl"),
);

export default ReactP5WrapperWithFade;
