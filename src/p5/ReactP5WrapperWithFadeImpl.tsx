import { ReactP5Wrapper, type P5WrapperProps } from "@p5-wrapper/react";
import * as React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

/**
 * Note: [Using client-side only code with SSR]
 *
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
 *
 *
 * Animation
 * ---------
 *
 * We use the CSSTransition to add an appear- animation, a simple fade. However,
 * this animation must get triggered when the component is loaded, so it is
 * _this_ component that must be lazily loaded.
 *
 * Because of this extra level of indirection, we have these two separate files.
 * If you don't understand why this is the case (or you're me and have
 * forgotten), just import and use {@link ReactP5WrapperWithFade}, forget about
 * this file.
 */
const ReactP5WrapperWithFadeImpl: React.FC<P5WrapperProps> = ({ sketch }) => {
    return (
        <Container_>
            <CSSTransition
                in={true}
                appear={true}
                timeout={300}
                classNames="fade"
            >
                <ReactP5Wrapper sketch={sketch} />
            </CSSTransition>
        </Container_>
    );
};

export default ReactP5WrapperWithFadeImpl;

const Container_ = styled.div`
    .fade-appear {
        opacity: 0;
    }
    .fade-appear-active {
        opacity: 1;
        transition: opacity 300ms ease-out;
    }
`;
