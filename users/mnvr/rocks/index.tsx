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
    background-color: rgba(255, 255, 255, 0.15);
    color: rgb(50, 29, 20);
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
            <PageImage
                page={page}
                name="gold"
                alt="Rust and gold colored rock face"
            />
        </>
    );
};
