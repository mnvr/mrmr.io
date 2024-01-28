import { useDayPreviewImages } from "components/gen24/preview-images";
import { Link } from "gatsby";
import { getSrc, type ImageDataLike } from "gatsby-plugin-image";
import { useIsDarkMode } from "hooks/use-is-dark-mode";
import * as React from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import styled from "styled-components";
import * as C from "./components";
import { sketch } from "./cover";
import { days, type Day } from "./days";

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
                January.
            </p>
            <p>
                This year, I've constrained myself to use only grids. So this is
                like a Griduary too.
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
                For <b>Day 14</b>, I created a{" "}
                <C.ELink href="https://mnvr.github.io/gm1k">
                    generative piece of music in 410 bytes of JS
                </C.ELink>
                .
            </p>
            <p>
                I've also created{" "}
                <Link to="cover">
                    a demonstration to show how much can be done just by simple,
                    basic grids
                </Link>{" "}
                - I start with the simplest possible grid, and derive the cover
                art that you see at the top.
            </p>
            <p>Have a great and inspiring 2024.</p>
        </>
    );
};

const DayList: React.FC = () => {
    const dayPreviewImages = useDayPreviewImages();
    const isDarkMode = useIsDarkMode();

    const withColorAdjustment = (day: Day): Day => {
        const color = (isDarkMode ? day.darkColor : day.color) ?? day.color;
        return { ...day, color };
    };

    return (
        <DayUL>
            {days.map((day, i) => (
                <li key={i}>
                    <DayCard
                        day={withColorAdjustment(day)}
                        previewImageData={dayPreviewImages[day.day]}
                        isDarkMode={isDarkMode}
                    />
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

    /* Give the list items a horizontal inset, but only on larger screens */
    @media (min-width: 500px) {
        margin-inline: 1rem;
    }

    li {
        margin-block: 1rem;
    }
`;

type DayCardProps = {
    day: Day;
    previewImageData?: ImageDataLike;
    isDarkMode: boolean;
};

const DayCard: React.FC<DayCardProps> = ({ day, previewImageData }) => {
    const previewImageSrc = previewImageData
        ? getSrc(previewImageData)
        : undefined;

    return (
        <Link to={`${day.day}`}>
            <DayCard_ color={day.color} $previewImageSrc={previewImageSrc}>
                <DayDescription {...day} />
                <HiOutlineChevronRight />
            </DayCard_>
        </Link>
    );
};

interface DayCardProps_ {
    color: string;
    $previewImageSrc?: string;
}

const DayCard_ = styled.div<DayCardProps_>`
    border: 1px solid ${(props) => props.color};

    background-image:
        linear-gradient(
            to right,
            var(--mrmr-background-color) 50%,
            transparent
        ),
        /* Nothing seems to break if url is undefined */
            url(${(props) => props.$previewImageSrc});
    background-position: top right;

    box-sizing: border-box;
    /* The fixed height of the preview images (in the Static GraphQL query
     * defined in 'preview-images.tsx') is 101px. Add 2px for the borders. */
    min-height: 103px;

    padding-inline: 1.5rem;

    display: flex;
    align-items: center;
    gap: 0.7rem;

    svg {
        color: var(--mrmr-secondary-color);
    }

    &:hover {
        color: ${(props) => props.color};

        svg {
            color: ${(props) => props.color};
        }
    }
`;

const DayDescription: React.FC<Day> = ({ day, prompt, color }) => {
    return (
        <p>
            <b>{`Day ${day}`}</b>
            <span style={{ color }}> · </span>
            <i>{prompt}</i>
        </p>
    );
};
