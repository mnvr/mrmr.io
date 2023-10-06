import ReactP5Wrapper from "p5/ReactP5Wrapper";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";
import { sketch } from "./sketch";

export const Sketch: React.FC = () => {
    return <ReactP5Wrapper sketch={sketch} />;
};

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <h1>
                The Universe Is
                <br />
                Its Own Simulation
            </h1>
            <div>
                <Caption>
                    Manav Rathi
                    <br />
                    {formattedDateMY}
                </Caption>
            </div>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-inline: auto;
    text-align: center;
`;

const Caption = styled.small`
    color: oklch(93.58% 0.12 151);
`;

export const ContentContainer = styled.div`
background-color: black;
`

export const EssayContainer = styled.div`
    margin-inline: auto;
    max-width: 24rem;
    color: #f7efef;//oklch(100% 0 0);

    /* text-align: justify; */
    /* background-color: black; */
`;
