import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
import styled from "styled-components";
import * as C from "./components";
import { sketch } from "./sketch";

export const Content: React.FC = () => {
    return (
        <C.Layout sketch={sketch}>
            <Description />
            <DayList />
        </C.Layout>
    );
};

const Description: React.FC = () => {
    return (
        <>
            <p>
                Genuary is an month-long online art fair (that's one way of
                putting it!) that happens every year, in, you guessed it,
                January. This year I thought I'll do remixes of the other
                Genuary art that I come across and find particularly inspiring.
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
                . The one you see above is not a remix, it is a cover I made to
                kickstart things off.{" "}
                {/*The remixes are below. Tap on any of them
                to view a live version.*/}
            </p>
            <p>Have a great and inspiring 2024.</p>
        </>
    );
};

const DayList: React.FC = () => {
    return (
        <DayUL>
            <D1 />
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
        padding-block: 1rem;
        padding-inline: 1.5rem;
        border: 1px solid tomato;

        display: flex;
        justify-content: space-between;
        align-items: center;

        svg {
            font-size: 1.2rem;
            /* color: tomato; */
        }
    }
`;

const D1: React.FC = () => {
    return (
        <li>
            <p>
                <b>Day 1</b> <span style={{color: "tomato"}}>·</span> <i>Particles</i>
            </p>
            <HiArrowRight />
        </li>
    );
};
