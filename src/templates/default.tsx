import React from "react";
import { graphql, HeadFC, PageProps } from "gatsby";
import type { Context } from "types";

const Page: React.FC<PageProps<Context>> = () => {
    return <>Body</>;
};

export default Page;

export const Head: HeadFC = () => <title>Test</title>;

export const query = graphql`
    query DefaultPage($id: String!) {
        mdx(id: { eq: $id }) {
            frontmatter {
                title
                key
            }
            fields {
                slug
            }
            body
        }
    }
`;
