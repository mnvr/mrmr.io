import * as React from "react";
import { BsPlayFill } from "react-icons/bs";
import styled from "styled-components";

export const IconButton = styled.button`
    /* Show the hand icon on hover */
    cursor: pointer;

    border: none;
    background: transparent;
    color: inherit;

    :hover {
        color: var(--mrmr-color-3);
    }
`;

export const PlayButton: React.FC = () => {
    return (
        <IconButton>
            <BsPlayFill size="2rem" title="Play" />
        </IconButton>
    );
};
