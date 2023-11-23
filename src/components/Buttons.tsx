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
    // Safari doesn't support rem units on SVG elements
    // So this could've just been
    //
    //     <IconButton>
    //         <BsPlayFill size="2rem" title="Play" />
    //     </IconButton>
    //
    // Except that causes Safari to log errors to the console. So we instead
    // wrap the icon in a container that sets the font size to 2rem;

    return (
        <IconButton>
            <PlayIconWrapper>
                <BsPlayFill title="Play" />
            </PlayIconWrapper>
        </IconButton>
    );
};

const PlayIconWrapper = styled.div`
    /* Workaround - Safari doesn't support rem units on SVG elements */
    font-size: 2rem;

    :hover {
        color: var(--mrmr-color-3);
    }
`;
