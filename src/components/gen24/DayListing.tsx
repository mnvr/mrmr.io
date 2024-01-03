import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, type ImageDataLike, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * A listing of links to all the days under gen24.
 *
 * This component really should be local to `pages/gen24`, it is not needed
 * anywhere else. However, we need to perform a static GraphQL query to get the
 * list of preview images, and Gatsby does not support using `useStaticQuery`
 * outside of the src folder [1].
 *
 * [1]: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/#must-be-in-src-directory
 */
const Page: React.FC = () => {
    return (
        <div>
            <Card />
        </div>
    );
};

export default Page;

const Card: React.FC = () => {
    return (
        <Card_>
            <Image />
            <CardContent />
        </Card_>
    );
};

const Card_ = styled.div`
    margin: 1rem;
    background-color: aliceblue;
    padding: 1rem;
    max-width: 30rem;

    display: grid;
`;

const CardContent: React.FC = () => {
    return <CardContent_>Hello</CardContent_>;
};

const CardContent_ = styled.div`
    background-color: rgba(255, 0, 0, 0.2);
    grid-area: 1 / 1;
    z-index: 1;
`;

const Image: React.FC = () => {
    const is = images();
    console.log("got", is);
    const gatsbyImageData = ensure(getImage(ensure(is[0])));
    return (
        <Image_>
            <GatsbyImage image={gatsbyImageData} alt="" />
        </Image_>
    );
    // return <div>Image</div>;
};

const Image_ = styled.div`
    grid-area: 1 / 1;
`;

const images = (): readonly ImageDataLike[] => {
    const data = useStaticQuery<Queries.Gen24PreviewImagesQuery>(graphql`
        query Gen24PreviewImages {
            allFile(
                filter: {
                    sourceInstanceName: { eq: "pages" }
                    ext: { regex: "/\\.(jpg|png)/" }
                    name: { eq: "preview" }
                    relativeDirectory: { glob: "gen24/*" }
                }
            ) {
                nodes {
                    relativeDirectory
                    childImageSharp {
                        gatsbyImageData
                    }
                }
            }
        }
    `);
    const allFile = replaceNullsWithUndefineds(data.allFile);
    return allFile.nodes;
};
