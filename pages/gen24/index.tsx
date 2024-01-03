import { useDayPreviewImages } from "components/gen24/preview-images";
import { Link } from "gatsby";
import { GatsbyImage, ImageDataLike, getImage } from "gatsby-plugin-image";
import * as React from "react";
import { HiArrowRight } from "react-icons/hi";
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
                I've also created a <Link to="cover">demonstration</Link> to
                show how much can be done just by simple, basic grids - I start
                with the simplest possible grid, and derive the cover art that
                you see at the top.
            </p>
            <p>Have a great and inspiring 2024.</p>
        </>
    );
};

const DayList: React.FC = () => {
    const dayPreviewImages = useDayPreviewImages();

    return (
        <DayUL>
            {days.map((day, i) => (
                <li key={i}>
                    <DayCard
                        day={day}
                        previewImageData={dayPreviewImages[day.day]}
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

    li {
        margin: 1rem;
    }
`;

type DayCardProps = {
    day: Day;
    previewImageData?: ImageDataLike;
};

const DayCard: React.FC<DayCardProps> = ({ day, previewImageData }) => {
    return (
        <Link to={`${day.day}`}>
            <DayCard_ color={day.color}>
                <DayDescription {...day} />
                <DayCardTrailing>
                    <DayCardPreviewImage imageData={previewImageData} />
                    <HiArrowRight />
                </DayCardTrailing>
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

    picture {
        opacity: 0.7;
    }

    &:hover picture {
        opacity: 1;
    }

    &:hover {
        color: ${(props) => props.color};
    }

    svg {
        font-size: 1.2rem;
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

const DayCardTrailing = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const DayCardPreviewImage: React.FC<{ imageData?: ImageDataLike }> = ({
    imageData,
}) => {
    const image = imageData ? getImage(imageData) : undefined;
    return image ? <GatsbyImage image={image} alt="" /> : <div />;
};
