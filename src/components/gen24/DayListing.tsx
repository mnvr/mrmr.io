import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * A listing of links to all the days under gen24.
 *
 * This component really should be local to `pages/gen24`, it is not needed
 * anywhere else. However, we need to perform a static GraphQL query to get the
 * list of preview images, and Gatsby does not support using `useStaticQuery`
 * outside of the src folder. There might be some convoluted way, but it is
 * simpler to just relocate this component into the src folder.
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
            <CardContent />
            <Image />
        </Card_>
    );
};

const Card_ = styled.div`
    margin: 1rem;
    background-color: aliceblue;
    padding: 1rem;
    max-width: 30rem;
`;

const CardContent: React.FC = () => {
    return <CardContent_>Hello</CardContent_>;
};

const CardContent_ = styled.div`
    background-color: rgba(255, 0, 0, 0.2);
`;

const Image: React.FC = () => {
    const is = images();
    console.log("got", is);
    const image = is[0];
    return <div>Image</div>;
};

const images = () => {
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
