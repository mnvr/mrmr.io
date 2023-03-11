import styled from "styled-components";

interface IconButtonProps {
    hoverColor?: string;
}

export const IconButton = styled.button<IconButtonProps>`
    /* Show the hand icon on hover */
    cursor: pointer;

    border: none;
    background: transparent;
    color: inherit;

    :hover {
        color: ${(props) => props.hoverColor ?? "inherit"};
    }
`;
