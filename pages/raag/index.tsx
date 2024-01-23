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
                raag <span className="muted">city</span>
            </h1>
            <big>
                रागों <span className="muted">की नगरी</span>
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

        .muted {
            color: var(--mrmr-color-3);
            margin-inline-start: -5px;
        }
    }

    big {
        font-size: 1.6em;

        .muted {
            color: var(--mrmr-color-3);
        }
    }
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
            bhairav
            <Notes />
        </RaagBhairav_>
    );
};

const RaagBhairav_ = styled.div`
    /* Taken from the page colors */
    background-color: oklch(49.35% 0.025 53.84);
    color: oklch(84.24% 0.006 43.32 / 0.8);
    --mrmr-raag-card-muted-color: oklch(84.24% 0.006 43.32 / 0.5);
    --mrmr-raag-card-highlighted-color: oklch(98% 0 0);

    @media (prefers-color-scheme: dark) {
        background-color: oklch(25% 0.05 83.84);
        color: oklch(75.15% 0.013 86.85 / 0.6);
        --mrmr-raag-card-muted-color: oklch(75.15% 0.013 86.85 / 0.5);
        --mrmr-raag-card-highlighted-color: oklch(94% 0 0);
    }

    padding-inline: 1.5em;
    padding-block: 1.25em;
    border-radius: 3px;

    font-variant: small-caps;

    display: flex;
    justify-content: space-between;

    .muted {
        background-color: var(--mrmr-raag-card-muted-color);
    }

    .highlighted {
        background-color: var(--mrmr-raag-card-highlighted-color);
    }
`;

const Notes: React.FC = () => {
    const notes = [0, 1, 4, 5, 7, 8, 11];
    const seq = () => Array(12).fill(0);
    return (
        <Notes_>
            {seq().map((_, i) => (
                <div
                    key={i}
                    className={notes.includes(i) ? "highlighted" : "muted"}
                />
            ))}
        </Notes_>
    );
};

const Notes_ = styled.div`
    display: flex;
    gap: 12px;

    & > div {
        width: 12px;
        height: 100%;
        border-radius: 3px;
    }
`;
