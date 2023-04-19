import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return <RockGold page={page} />;
};

const RockGold: React.FC<{ page: Page }> = ({ page }) => {
    const image = ensure(getImage(ensure(page.images["gold"])));

    return <GatsbyImage image={image} alt="Rust and gold colored rock face" />;
};

const Title: React.FC = () => {
    return <h1>Rocks</h1>;
};
