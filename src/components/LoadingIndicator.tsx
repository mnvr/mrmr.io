import styled from "styled-components";

export const LoadingIndicator = styled.div`
    /* Same size as the IconButton components, in particular, PlayButton */
    width: 2rem;
    height: 2rem;

    /* Give it a thick rounded border, except at the bottom */
    border-radius: 50%;
    border: 3px white dotted;
    border-bottom: 3px transparent dotted;

    /* Rotate it, at 1 revolutions per second */
    animation: rotate 1s ease-out infinite;

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
