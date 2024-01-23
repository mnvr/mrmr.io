import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Container_>
            <WideColumn>
                <Title />
                {children}
            </WideColumn>
        </Container_>
    );
};

const Container_ = styled.div`
    font-size: 20px;

    p {
        line-height: 1.5em;
    }
`;

const Title: React.FC = () => {
    return (
        <Title_>
            <h1>
                <T1>city of </T1> raags
            </h1>
            <big>
                रागों <T1> की नगरी</T1>
            </big>
        </Title_>
    );
};

const Title_ = styled.div`
    font-family: serif;
    font-style: italic;

    text-align: center;

    h1 {
        font-size: 2.25em;
        margin-block-end: 0.1em;
    }

    big {
        margin-inline-start: -1px;
    }
`;

const T1 = styled.span`
    color: var(--mrmr-color-3);
`;
