import { Link } from "gatsby";
import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
import styled from "styled-components";
import * as C from "./components";
import { days, type Day } from "./days";
import { sketch } from "./cover";

export const Content: React.FC = () => {
    return (
        <C.Layout sketch={sketch}>
            <Description />
            <DayList />
            <Description2 />
        </C.Layout>
    );
};

const Description: React.FC = () => {
    return (
        <>
            <p>
                Genuary is an month-long online art fair (that's one way of
                putting it!) that happens every year, in, you guessed it,
                January. This year I thought I'll do remixes of other
                Genuary art that I like.
            </p>
            <p>
                Additionally, I've constrained myself to use only grids. So this
                is like a Griduary too.
            </p>
            <p>
                I'm using p5.js to make these sketches, and the{" "}
                <C.ELink href="https://github.com/mnvr/mrmr.io/tree/main/pages/gen24">
                    source code for all of these is available on GitHub
                </C.ELink>
                .
            </p>
        </>
    );
};

const Description2: React.FC = () => {
    return (
        <>
            <p>
                I've also created a <Link to="cover">demonstration</Link> to
                show how much can be done just by simple, basic grids - I start
                with the simplest possible grid, and derive the cover art that
                you see at top.
            </p>
            <p>Have a great and inspiring 2024.</p>
        </>
    );
};

const DayList: React.FC = () => {
    return (
        <DayUL>
            {days.map((day, i) => (
                <li key={i}>
                    <DayCard {...day} />
                </li>
            ))}
        </DayUL>
    );
};

const DayUL = styled.ul`
    margin-block: 2rem;

    /* Remove default list formatting */
    list-style: none;
    padding-inline-start: 0;

    li {
        margin: 1rem;
    }
`;

const DayCard: React.FC<Day> = ({ day, prompt, color }) => {
    return (
        <Link to={`${day}`}>
            <DayCard_ color={color}>
                <p>
                    <b>{`Day ${day}`}</b>
                    <span style={{ color }}> · </span>
                    <i>{prompt}</i>
                </p>
                <HiArrowRight />
            </DayCard_>
        </Link>
    );
};

const DayCard_ = styled.div<{ color: string }>`
    border: 1px solid ${(props) => props.color};

    padding-block: 1rem;
    padding-inline: 1.5rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        color: ${(props) => props.color};
    }

    svg {
        font-size: 1.2rem;
    }
`;
