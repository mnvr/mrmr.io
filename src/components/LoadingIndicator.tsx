import styled from "styled-components";

export const LoadingIndicator = styled.div`
    /* Same size as the IconButton components, in particular, PlayButton */
    width: 2rem;
    height: 2rem;

    /* Give it a thick rounded border, except at the bottom */
    border-radius: 50%;
    border: 5px white solid;
    border-bottom: 5px transparent solid;

    /* Rotate it, at 1 revolutions per second */
    animation: rotate 1s linear infinite;

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
