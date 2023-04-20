import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <>
            <Title />
            <RockImages page={page} />
        </>
    );
};

const Title: React.FC = () => {
    return (
        <TitleContainer>
            <h1>Rocks</h1>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    position: absolute;
    z-index: 1;
    width: 100%;
    text-align: center;
    /* Tuned for the first rock image, "gold.jpg" */
    background-color: rgba(0, 0, 0, 0.1);
    color: hsl(50, 88%, 88%);
`;

interface PageImageProps {
    page: Page;
    name: string;
    alt: string;
}

const PageImage: React.FC<PageImageProps> = ({ page, name, alt }) => {
    const image = ensure(getImage(ensure(page.images[name])));

    return <GatsbyImage image={image} alt={alt} />;
};

const RockImages: React.FC<{ page: Page }> = ({ page }) => {
    return (
        <>
            {rockImages.map(({ name, alt }) => {
                return (
                    <RockImageContainer key={name}>
                        <PageImage page={page} name={name} alt={alt} />
                    </RockImageContainer>
                );
            })}
        </>
    );
};

const RockImageContainer = styled.div`
    border-bottom: 1px solid transparent;
`;

const rockImages = [
    {
        name: "gold",
        alt: "Rust and gold colored rock face",
    },
    {
        name: "cave-art",
        alt: "Rock face with colors reminiscent of prehistoric cave art",
    },
];
