import Loadable from "@loadable/component";

/**
 * Importing the Sketch component from the p5-react package in a SSR environment
 * (Gatsby) gives the "window is not defined" error (as is expected, since
 * importing p5 requires window to be available, and it isn't when server side
 * rendering).
 *
 * To resolve this, we can use Gatsby's loadable-components, which allow us to
 * load client-side dependent components asynchronously.
 *
 * https://github.com/Gherciu/react-p5#using-it-in-an-ssr-environment-nextjs-or-gatsby
 */
const Sketch = Loadable(() => import("react-p5"));

export default Sketch;
