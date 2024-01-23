import { WideColumn } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Contents: React.FC = ({}) => {
    return (
        <Container_>
            <WideColumn>
                <Title />
                <RaagList />
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

const RaagList: React.FC = () => {
    return (
        <RaagList_>
            <li>
                <RaagBhairav />
            </li>
        </RaagList_>
    );
};

const RaagList_ = styled.ul`
    list-style: none;
    padding-inline-start: 0;

    li {
        margin: 1em;
    }
`;

const RaagBhairav: React.FC = () => {
    return (
        <RaagBhairav_>
            <RaagName>
                <div>bhairav</div>
            </RaagName>
            <Notes />
        </RaagBhairav_>
    );
};

const RaagName = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4em;
    min-height: 50px;
`;

const RaagBhairav_ = styled.div`
    background-color: oklch(49.35% 0.025 53.84);
    color: oklch(84.24% 0.006 43.32);
    --mrmr-note-highlighted-color: oklch(98% 0 0);

    @media (prefers-color-scheme: dark) {
        background-color: oklch(25% 0.05 83.84);
        color: oklch(94% 0 0);
        --mrmr-note-muted-color: oklch(75.15% 0.013 86.85);
    }

    border-radius: 3px;

    padding-inline: 1.5em;
    padding-block: 1.25em;
    /* font-style: italic; */
    /* font-family: monospace; */
    font-variant: small-caps;

    display: flex;
    justify-content: space-between;

    .highlighted {
        color: var(--mrmr-note-highlighted-color);
        background-color: var(--mrmr-note-highlighted-color);
    }
`;

const Notes: React.FC = () => {
    const notes = [0, 1, 4, 5, 7, 8, 11];
    return (
        <Notes_>
            {Array(12)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={notes.includes(i) ? "highlighted" : ""}
                    />
                ))}
        </Notes_>
    );
};

const Notes_ = styled.div`
    /* border: 1px solid tomato; */
    display: flex;
    gap: 12px;

    & > div {
        width: 15px;
        height: 100%;
        border-radius: 3px;
        background-color: oklch(84.24% 0.006 43.32 / 0.6);
    }
`;
