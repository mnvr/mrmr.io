import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

export const FooterHomePageLogo: React.FC = () => {
    const data = useStaticQuery<Queries.LogoQuery>(graphql`
        query Logo {
            file(
                sourceInstanceName: { eq: "assets" }
                relativePath: { eq: "logo.png" }
            ) {
                childImageSharp {
                    gatsbyImageData(
                        layout: FIXED
                        width: 80
                        placeholder: NONE
                        transformOptions: { grayscale: true }
                    )
                }
            }
        }
    `);

    const file = replaceNullsWithUndefineds(data.file);
    const imageData = ensure(file?.childImageSharp);
    const image = ensure(getImage(imageData));

    return <GatsbyImage image={image} alt={""} />;
};
