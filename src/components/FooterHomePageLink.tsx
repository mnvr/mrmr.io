import { Link, graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

export const FooterHomePageLink: React.FC = ({}) => {
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
        <LinkContainer>
            <Link to={"/"} title={"More by me"}>
                <LinkContents>
                    <CaptionContainer>More by me</CaptionContainer>
                    <GatsbyImage image={image} alt={""} />
                </LinkContents>
            </Link>
        </LinkContainer>
    );
};

const LinkContainer = styled.div`
    display: flex;
    justify-content: center;

    a {
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        opacity: 0.77;
    }
`;

const LinkContents = styled.div`
    display: flex;

    flex-direction: column;
    align-items: center;
    gap: 2rem;

    img {
        border-radius: 5px;
    }
`;

const CaptionContainer = styled.div`
    font-size: 0.7rem;
    font-weight: 600;

    text-align: center;

    color: oklch(48% 0 0);
`;
