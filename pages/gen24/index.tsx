import { useDayPreviewImages } from "components/gen24/preview-images";
import { Link } from "gatsby";
import {
    GatsbyImage,
    ImageDataLike,
    getImage,
    getSrc,
} from "gatsby-plugin-image";
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
    const previewImageSrc = previewImageData
        ? getSrc(previewImageData)
        : undefined;

    return (
        <Link to={`${day.day}`}>
            <DayCard_ color={day.color} $previewImageSrc={previewImageSrc}>
                <DayCardLeading>
                    <DayDescription {...day} />
                    <HiOutlineChevronRight />
                </DayCardLeading>
                {/* <DayCardPreviewImage imageData={previewImageData} /> */}
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

    background-image: linear-gradient(to right, black, black, transparent),
        url(${(props) => props.$previewImageSrc});
    background-position: top right;
    /* background-repeat: no-repeat; */
    padding-block: 1rem;
    padding-inline-start: 1.5rem;
    padding-inline-end: 1.4rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    /** This is the className we pass to GatsbyImage in DayCardPreviewImage  */
    .preview-image-wrapper {
        opacity: 0.7;
    }

    &:hover .preview-image-wrapper {
        opacity: 1;
    }

    svg {
        color: var(--mrmr-color-3);
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

const DayCardLeading = styled.div`
    display: flex;
    align-items: center;
    gap: 0.7rem;
`;

const DayCardPreviewImage: React.FC<{ imageData?: ImageDataLike }> = ({
    imageData,
}) => {
    const image = imageData ? getImage(imageData) : undefined;
    return image ? (
        <GatsbyImage className="preview-image-wrapper" image={image} alt="" />
    ) : (
        <div />
    );
};
