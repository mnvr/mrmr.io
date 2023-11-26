import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

/**
 * Show the generatedPageImage associated with the current page.
 *
 * This is meant to help in quick debugging and is unlikely to be useful for the
 * actual pages.
 */
export const GeneratedPreviewImage: React.FC = ({}) => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { generatedPreviewImage } = page;

    if (!generatedPreviewImage) return <div />;

    const image = ensure(getImage(generatedPreviewImage));

    return <GatsbyImage image={image} alt={""} />;
};
