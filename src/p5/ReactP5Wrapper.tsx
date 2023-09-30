import loadable from "@loadable/component";

/**
 * Importing the Sketch component from the p5-react package in a SSR environment
 * (Gatsby) gives the "window is not defined" error (as is expected, since
 * importing p5 requires window to be available, and it isn't when server side
 * rendering).
 *
 * To resolve this, we can use Gatsby's loadable-components, which allow us to
 * load client-side dependent components asynchronously.
 */
const P5Wrapper = loadable(() => import("@p5-wrapper/react"), {
    resolveComponent: ({ ReactP5Wrapper }) => ReactP5Wrapper,
});

export default P5Wrapper;
