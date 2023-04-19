import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return <RockGold page={page} />;
};

const RockGold: React.FC<{ page: Page }> = ({ page }) => {
    const image = ensure(getImage(ensure(page.images["gold"])));
    console.log(image);
    return (
        <ImageContainer>
            <GatsbyImage image={image} alt="Rust and gold colored rock face" />
        </ImageContainer>
    );
};

const ImageContainer = styled.div`
    /* height: 100vh; */
`;

const Image = styled.img`
    width: 100%;
    /* min-height: 100vh; */
`;

const Title: React.FC = () => {
    return <h1>Rocks</h1>;
};
