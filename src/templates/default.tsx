import Column from "components/Column";
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
    const { title } = parseData(data);

    return (
        <main>
            <Column>
                <h1>{title}</h1>
                {children}
            </Column>
        </main>
    );
};

export default Page;

export const Head: HeadFC<Queries.DefaultPageQuery, Context> = ({ data }) => {
    const pd = parseData(data);

    return (
        <CustomHead title={pd.title}>
            <Body {...pd} />
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

interface ParsedData {
    title: string;
    backgroundColor: string;
    foregroundColor: string;
}

const parseData = (data: Queries.DefaultPageQuery) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);

    const title = mdx?.frontmatter?.title;
    if (!title) {
        throw new Error("Required `title` property is missing in page query");
    }

    const { backgroundColor, foregroundColor } = parseColors(
        mdx?.frontmatter?.colors
    );

    return { title, backgroundColor, foregroundColor };
};

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

    const foregroundColor = colors[1];
    if (!foregroundColor) {
        throw new Error("Foreground color is required by the default template");
    }

    return { backgroundColor, foregroundColor };
};

const Body = styled.body<ParsedData>`
    /* Reset the margin */
    margin: 0;

    /* Set the font */
    font-family: system-ui, sans-serif;

    /* Set the colors as per the MDX frontmatter */
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.foregroundColor};
`;
