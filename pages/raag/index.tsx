import { WideColumn } from "components/Column";
import { LinkStyleBoldHover } from "components/LinkStyles";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { raagBhairav, raagYaman } from "./raag";

export const Contents: React.FC = ({}) => {
    return (
        <Container_>
            <WideColumn>
                <Title />
                <RaagList />
                <Footer />
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
            color: var(--mrmr-secondary);
            margin-inline-start: -5px;
        }

        margin-inline-start: 5px;
    }

    big {
        font-size: 1.6em;

        .muted {
            color: var(--mrmr-secondary);
        }
    }
`;

const RaagList: React.FC = () => {
    return (
        <RaagList_>
            <li>
                <RaagBhairav />
            </li>
            <li>
                <RaagYaman />
            </li>
        </RaagList_>
    );
};

const RaagList_ = styled.ul`
    list-style: none;
    padding-inline-start: 0;

    li {
        margin: 1em;
        /* Remove the margin on small screens (we already have a margin from the
           page edge because of the WideColumn above) */
        @media (max-width: 600px) {
            margin-inline: 0;
        }

        a {
            text-decoration: none;
            opacity: 0.94;
            @media (prefers-color-scheme: dark) {
                opacity: 0.84;
            }
        }

        a:hover {
            opacity: 1;
        }
    }
`;

const RaagCard = styled.div`
    padding-inline: 1.25em;
    padding-block: 0.75em;
    border-radius: 3px;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    .muted {
        background-color: var(--mrmr-raag-card-muted-color);
    }

    .highlighted {
        background-color: var(--mrmr-raag-card-highlighted-color);
    }
`;

const Name = styled.div`
    font-variant: small-caps;
    /* Shift up a bit from the centerline to account for the small-caps having
    empty space at the top (as compared to if they were full caps). */
    margin-block-end: 4px;
    width: 150px;
`;

interface NotesProps {
    /** notes on the raag, expressed as offsets from the root */
    notes: Array<number>;
}

const Notes: React.FC<NotesProps> = ({ notes }) => {
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
    flex-grow: 1;
    flex-basis: calc(12px * (12 + 11));
    display: flex;
    justify-content: space-between;

    & > div {
        width: 12px;
        height: 42px;
        border-radius: 3px;
    }
`;

const Footer: React.FC = () => {
    return (
        <Footer_>
            <Link to={"about"}>FAQ</Link>
        </Footer_>
    );
};

const Footer_ = styled(LinkStyleBoldHover)`
    margin-block: 3rem;

    font-size: 16px;
    text-align: center;

    a {
        padding: 8px;
        border-radius: 4px;
    }
`;

const RaagBhairav: React.FC = () => {
    return (
        <Link to={"bhairav"}>
            <RaagBhairav_>
                <Name>bhairav</Name>
                <Notes notes={raagBhairav.notes} />
            </RaagBhairav_>
        </Link>
    );
};

const RaagBhairav_ = styled(RaagCard)`
    /* Taken from the page colors */
    background-color: oklch(49.35% 0.025 53.84);
    color: oklch(84.24% 0.006 43.32);
    --mrmr-raag-card-muted-color: oklch(84.24% 0.006 43.32 / 0.3);
    --mrmr-raag-card-highlighted-color: oklch(98% 0 0);

    @media (prefers-color-scheme: dark) {
        background-color: oklch(25% 0.05 83.84);
        color: oklch(75.15% 0.013 86.85);
        --mrmr-raag-card-muted-color: oklch(75.15% 0.013 86.85 / 0.3);
        --mrmr-raag-card-highlighted-color: oklch(94% 0 0);
    }
`;

const RaagYaman: React.FC = () => {
    return (
        <Link to={"yaman"}>
            <RaagYaman_>
                <Name>yaman</Name>
                <Notes notes={raagYaman.notes} />
            </RaagYaman_>
        </Link>
    );
};

const RaagYaman_ = styled(RaagCard)`
    background-color: oklch(52% 0.166 267);
    color: oklch(94% 0 0);
    --mrmr-raag-card-muted-color: oklch(80% 0.065 265 / 0.5);
    --mrmr-raag-card-highlighted-color: oklch(94% 0 0);
`;
