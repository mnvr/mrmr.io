import { SignoffContents } from "components/Signoff";
import { Link } from "gatsby";
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
        background-color: var(--mrmr-background-color-1);

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -48%);
        width: 16rem;
        height: 16rem;
        border-radius: 50%;
    }

    h1 {
        z-index: 1;
    }
`;

export const Text = styled.div`
    margin-inline: 1rem;
    margin-block: 3rem;

    p {
        max-width: 30rem;
        margin-inline: auto;
        font-size: 1.5rem;
    }

    p:nth-child(odd) {
        color: var(--mrmr-color-2);
    }
`;

export const Signoff: React.FC = () => {
    return (
        <Signoff_>
            <SignoffContents />
        </Signoff_>
    );
};

const Signoff_ = styled.div`
    background-color: var(--mrmr-color-1);
    color: var(--mrmr-background-color-1);
    padding: 1rem;
    min-height: 20svh;
`;

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <div>
                <Link to={"/all"}>All posts</Link>
                <br />
                <Link to={"/"}>Home</Link>
            </div>
        </Footer_>
    );
};

const Footer_ = styled.div`
    background-color: var(--mrmr-color-2);
    color: var(--mrmr-background-color-1);
    padding: 1rem;
    min-height: 60svh;
    line-height: 2rem;

    a {
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: bold;
    }

    a:hover {
        border-bottom: 2px solid currentColor;
    }
`;
