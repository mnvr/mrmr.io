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
