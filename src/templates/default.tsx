import CustomHead from "components/CustomHead";
import { graphql, HeadFC, PageProps } from "gatsby";
import React from "react";
import styled from "styled-components";
import type { Context } from "types";

const Page: React.FC<PageProps<Queries.DefaultPageQuery, Context>> = ({
    data,
    children,
}) => {
    const title = data.mdx?.frontmatter?.title;
    if (!title) {
        throw new Error("Required `title` property is missing in page query");
    }

    return (
        <Main>
            <h1>{title}</h1>
            {children}
        </Main>
    );
};

export default Page;

export const Head: HeadFC<Queries.DefaultPageQuery, Context> = ({ data }) => {
    const title = data.mdx?.frontmatter?.title;
    if (!title) {
        throw new Error("Required `title` property is missing in page query");
    }

    return (
        <CustomHead {...{ title }}>
            <Body />
        </CustomHead>
    );
};

export const query = graphql`
    query DefaultPage($id: String!) {
        mdx(id: { eq: $id }) {
            frontmatter {
                title
            }
        }
    }
`;

const Body = styled.body`
    background-color: tomato;
`;

const Main = styled.main`
    background-color: aliceblue;
`;
