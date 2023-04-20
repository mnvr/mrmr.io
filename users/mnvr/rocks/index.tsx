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
            <TitleH2>Rocks</TitleH2>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    position: absolute;
    z-index: 1;
    width: 100%;
    font-variant: small-caps;
    /* Tuned for the first rock image, "painting.jpg" */
    background-color: rgba(82, 80, 85, 0.4);
`;

const TitleH2 = styled.h2`
    margin: 0.5rem;
    padding-inline: 0.5rem;
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
        name: "painting",
        alt: "A rock face that looks like a painting with thick, yet intricate, brush strokes",
    },
    {
        name: "granite",
        alt: "A comforting, carbon like rock face",
    },
    {
        name: "gold",
        alt: "Rust and gold colored rock face",
    },
    {
        name: "red",
        alt: "A red colored rock face, drifting into cream",
    },
    {
        name: "people",
        alt: "Rock face with shades of brown, appearing like silhouettes of people",
    },
    {
        name: "silver",
        alt: "A silver, shiny, rock face",
    },
    {
        name: "disintegrating",
        alt: "A rock that is disintegrating into its constituent shards",
    },
];
