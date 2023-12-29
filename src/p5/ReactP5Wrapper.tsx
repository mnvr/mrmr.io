import loadable from "@loadable/component";

/**
 * Importing the Sketch component from the p5-react package in a SSR environment
 * (Gatsby) gives the "window is not defined" error (as is expected, since
 * importing p5 requires window to be available, and it isn't when server side
 * rendering).
 *
 * To resolve this, we can use loadable-components, which is primarily a code
 * splitting mechanism, but here it allow us to load components with client-side
 * dependencies asynchronously.
 *
 * For more details, see the documentation for loadable-components:
 * https://loadable-components.com/
 *
 * For a comparison with Suspense, see
 * https://github.com/mnvr/suspense-vs-loadable.
 */
const P5Wrapper = loadable(() => import("@p5-wrapper/react"), {
    resolveComponent: ({ ReactP5Wrapper }) => ReactP5Wrapper,
});

export default P5Wrapper;
