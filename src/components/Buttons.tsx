import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import styled from "styled-components";

export const IconButton = styled.button`
    /* Show the hand icon on hover */
    cursor: pointer;

    border: none;
    background: transparent;
    color: inherit;
`;

export const PlayButton: React.FC = () => {
    // Note: [Workaround - Safari doesn't support rem units on SVG elements]
    //
    // Tis could've just been
    //
    //     <IconButton>
    //         <BsPlayFill size="2rem" title="Play" />
    //     </IconButton>
    //
    // However, Safari (as of 17) doesn't support rem units on SVG elements. So
    // setting the size="2rem" causes Safari to log errors to the console.
    //
    // As a workaround, we instead wrap the icon in a container that sets the
    // font-size to 2rem.

    return (
        <IconButton>
            <PlayIconWrapper>
                <BsPlayFill title="Play" />
            </PlayIconWrapper>
        </IconButton>
    );
};

const PlayIconWrapper = styled.div`
    /* See Note: [Workaround - Safari doesn't support rem units on SVG elements] */
    font-size: 2rem;

    :hover {
        color: var(--mrmr-color-3);
    }
`;
