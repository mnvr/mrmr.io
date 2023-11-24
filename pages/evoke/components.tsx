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
    background-color: #3df9e4;
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
        color: #3df9e4;
        /* color: white; */
    }
`;

export const Text = styled.div`
    margin: 1rem;

    p {
        /* color: #; */
        max-width: 30rem;
        margin-inline: auto;
        /* font-weight: 700; */
        font-size: 1.5rem;
    }

    p:nth-child(even) {
        color: #3df9e4;
    }
`;
