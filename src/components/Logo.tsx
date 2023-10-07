import { Link, graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import "styles/global.css";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

export const Logo: React.FC = ({}) => {
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

    return (
        <LogoContainer>
            <Link to={"/"} title={"More by me"}>
                <GatsbyImage image={image} alt={""} />
            </Link>
        </LogoContainer>
    );
};

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-block: 1rem;

    a {
        opacity: 0.5;
    }

    a:hover {
        opacity: 0.77;
    }
`;
