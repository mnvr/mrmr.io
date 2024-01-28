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
            <div className="container">
                <div className="figure" />
                <h3>{title}</h3>
            </div>
        </Title_>
    );
};

const Title_ = styled.div`
    background-color: var(--mrmr-text-color);
    padding-inline: 1rem;
    padding-block: 3rem;
    font-size: 2rem;

    line-height: 1.5;

    .container {
        max-width: 30rem;
        margin-inline: auto;
        min-height: 55svh;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    h3 {
        color: var(--mrmr-background-color);
        margin: 0;
    }

    .figure {
        margin-inline-start: 2px;
        box-sizing: border-box;
        width: 4rem;
        height: 4rem;
        border: 2px solid var(--mrmr-background-color);
    }
`;

export const Text = styled.div`
    margin-inline: 1rem;
    margin-block: 3rem;

    line-height: 1.5;

    p {
        max-width: 30rem;
        margin-inline: auto;
        font-size: 1.5rem;
    }

    p:nth-child(even) {
        color: var(--mrmr-title-color);
    }
`;

export const Signoff = styled(SignoffContents)`
    background-color: var(--mrmr-text-color);
    color: var(--mrmr-background-color);
    padding: 1rem;
    padding-block-start: 1.3rem;
    line-height: 1.45;
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
    background-color: var(--mrmr-title-color);
    color: var(--mrmr-background-color);
    padding: 1rem;
    padding-block-start: 1.4rem;
    min-height: 60svh;
    line-height: 2.5;

    a {
        text-decoration: none;
        font-weight: bold;
    }

    a:hover {
        border-bottom: 2px solid currentColor;
    }
`;
