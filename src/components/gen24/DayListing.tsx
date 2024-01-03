import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import styled from "styled-components";

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

export const Image: React.FC = () => {
    const data = useStaticQuery(graphql`
        query MyQuery {
            allFile(
                filter: {
                    name: { eq: "preview" }
                    relativeDirectory: { glob: "gen24/*" }
                }
            ) {
                nodes {
                    id
                    name
                    relativeDirectory
                    relativePath
                    childImageSharp {
                        gatsbyImageData
                    }
                }
            }
        }
    `);
    console.log("data", data);
    return <div>Image</div>;
};
