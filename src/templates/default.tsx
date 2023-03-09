import { DefaultGlobalStyle } from "components/GlobalStyle";
import { DefaultHead } from "components/Head";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import type { Context } from "types";
import { ensure, parseDefaultTemplateColors } from "utils/parse";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const Page: React.FC<PageProps<Queries.DefaultPageQuery, Context>> = ({
    data,
    children,
}) => {
    /* Set the colors as per MDX frontmatter */
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

    // Workaround for undefined `global` error
    //
    // Line 47 or hydra-synth.js has the following line
    //
    //     global.window.test = 'hi'
    //
    // This causes a runtime error because of `global` not being defined.
    const hydraGlobalWorkaround = `global = { window: {} };`;

    return (
        <DefaultHead title={title}>
            <script>{hydraGlobalWorkaround}</script>
        </DefaultHead>
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

const parseData = (data: Queries.DefaultPageQuery) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);
    const title = ensure(mdx?.frontmatter?.title);
    const { backgroundColor, color } = parseDefaultTemplateColors(
        mdx?.frontmatter?.colors
    );

    return { title, backgroundColor, color };
};
