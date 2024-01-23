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
        line-height: 1.4em;
    }

    blockquote {
        color: var(--mrmr-color-3);
        border-left: 1px solid currentColor;
        margin-inline: 0em;
        padding-inline: 1.3em;
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

    margin-block: 2.2em;

    h1 {
        font-size: 2.25em;
        margin-block-end: 0.4em;
    }

    big {
        margin-inline-start: -1px;
    }
`;

const T1 = styled.span`
    color: var(--mrmr-color-3);
`;
