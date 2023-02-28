import CustomHead from "components/CustomHead";
import { graphql, HeadFC, PageProps } from "gatsby";
import React from "react";
import styled from "styled-components";
import type { Context } from "types";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const Page: React.FC<PageProps<Queries.DefaultPageQuery, Context>> = ({
    data,
    children,
}) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);

    const title = mdx?.frontmatter?.title;
    if (!title) {
        throw new Error("Required `title` property is missing in page query");
    }

    const { backgroundColor, foregroundColor } = parseColors(
        mdx?.frontmatter?.colors
    );

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
                colors
            }
        }
    }
`;

const parseColors = (colors: readonly (string | undefined)[] | undefined) => {
    if (!colors) {
        throw new Error("Required `colors` property is missing in page query");
    }

    if (colors.length < 2) {
        throw new Error(
            "At least 2 `colors` are required by the default template"
        );
    }

    const backgroundColor = colors[0];
    if (!backgroundColor) {
        throw new Error("Background color is required by the default template");
    }

    const foregroundColor = colors[0];
    if (!foregroundColor) {
        throw new Error("Foreground color is required by the default template");
    }

    return { backgroundColor, foregroundColor };
};

const Body = styled.body`
    background-color: tomato;
`;

const Main = styled.main`
    background-color: aliceblue;
`;
