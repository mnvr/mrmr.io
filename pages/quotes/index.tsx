import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    return (
        <Main>
            <Quotes />
        </Main>
    );
};

const Main = styled.main`
    margin: 1rem;
`;

const Quotes: React.FC = () => {
    const quotes = ["Chaos is a ladder"];
    const text = ensure(quotes[0]);

    return <Quote text={text} />;
};

interface QuoteProps {
    text: string;
}

const Quote: React.FC<QuoteProps> = ({ text }) => {
    return <div>{text}</div>;
};
