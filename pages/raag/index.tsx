import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Contents: React.FC = ({}) => {
    return (
        <Container_>
            <WideColumn>
                <Title />
                Hello
            </WideColumn>
        </Container_>
    );
};

const Container_ = styled.div`
    font-size: 20px;
`;

const Title: React.FC = () => {
    return (
        <Title_>
            <h1>
                raag <T1>city</T1>
            </h1>
            <big>
                रागों <T1H>की नगरी</T1H>
            </big>
        </Title_>
    );
};

const Title_ = styled.div`
    font-family: serif;
    font-style: italic;

    text-align: center;

    margin-block: 2.2em;

    h1 {
        font-size: 3em;
        margin-block-end: 7px;
    }

    big {
        font-size: 1.6em;
    }
`;

const T1 = styled.span`
    color: var(--mrmr-color-3);
    margin-inline-start: -5px;
`;

const T1H = styled.span`
    color: var(--mrmr-color-3);
`;
