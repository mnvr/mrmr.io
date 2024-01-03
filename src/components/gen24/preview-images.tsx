import { graphql, useStaticQuery } from "gatsby";
import { type ImageDataLike } from "gatsby-plugin-image";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * Fetch GatsbyImageData of all preview images of the child pages of `/gen24`.
 *
 * This file really should be local to `pages/gen24`, it is not needed anywhere
 * else. However, we need to perform a static GraphQL query to get the list of
 * preview images, and Gatsby does not support using `useStaticQuery` outside of
 * the src folder [1].
 *
 * The returned images are indexed by the "day", which is really the last path
 * component. e.g. the {@link gatsbyImageData} for '/pages/gen24/1/preview.png'
 * will be present with the key "1".
 *
 * [1]:
 * https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/#must-be-in-src-directory
 */
export const useDayPreviewImages = (): Record<string, ImageDataLike> => {
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
                        gatsbyImageData(
                            layout: FIXED,
                            height: 50,
                            placeholder: NONE
                        )
                    }
                }
            }
        }
    `);

    const allFile = replaceNullsWithUndefineds(data.allFile);
    let result: Record<string, ImageDataLike> = {};
    for (const node of allFile.nodes) {
        const day = ensure(node.relativeDirectory.split("/").pop());
        result[day] = node;
    }
    return result;
};
