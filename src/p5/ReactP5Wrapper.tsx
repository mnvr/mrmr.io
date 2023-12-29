import loadable from "@loadable/component";

/**
 * A lazily loaded ReactP5Wrapper component from the "@p5-wrapper/react"
 * library.
 *
 * See also {@link ReactP5WrapperWithFade} for a variant of this that adds a
 * fade-in animation on appear.
 */
const P5Wrapper = loadable(() => import("@p5-wrapper/react"), {
    resolveComponent: ({ ReactP5Wrapper }) => ReactP5Wrapper,
});

export default P5Wrapper;
