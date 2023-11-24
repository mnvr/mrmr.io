import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Title: React.FC = ({}) => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title } = page;

    return (
        <Title_>
            <div className="circle" />
            <h1>{title}</h1>
        </Title_>
    );
};

const Title_ = styled.div`
    background-color: var(--mrmr-color-1);
    padding: 1rem;
    min-height: 60svh;
    font-size: 2rem;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .circle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -48%);
        background-color: var(--mrmr-background-color-1);
        width: 16rem;
        height: 16rem;
        border-radius: 50%;
    }

    h1 {
        z-index: 1;
        color: oklch(82.42% 0.251 145.5);
        color: white;
    }
`;

export const Text = styled.div`
    margin: 1rem;
`;
