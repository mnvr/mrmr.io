import loadable from "@loadable/component";

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
