import { DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import type { Context } from "types";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const Page: React.FC<PageProps<Queries.DefaultPageQuery, Context>> = ({
    data,
    children,
}) => {
    /* Set the colors as per the MDX frontmatter */
    const { backgroundColor, color } = parseData(data);

    return (
        <main>
            <DefaultGlobalStyle {...{ backgroundColor, color }} />
            {children}
        </main>
    );
};

export default Page;

export const Head: HeadFC<Queries.DefaultPageQuery, Context> = ({ data }) => {
    const { title } = parseData(data);

    return <DefaultHead title={title} />;
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

const parseData = (data: Queries.DefaultPageQuery) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);

    const title = mdx?.frontmatter?.title;
    if (!title) {
        throw new Error("Required `title` property is missing in page query");
    }

    const { backgroundColor, color } = parseColors(mdx?.frontmatter?.colors);

    return { title, backgroundColor, color };
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

    const color = colors[1];
    if (!color) {
        throw new Error("Foreground color is required by the default template");
    }

    return { backgroundColor, color };
};
