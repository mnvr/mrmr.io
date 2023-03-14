import { DefaultHead } from "components/Head";
import {
    createPageColorStyleProps,
    PageColorStyle,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import { ensure } from "utils/ensure";
import { parsePageColors } from "utils/page-colors";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const Page: React.FC<PageProps<Queries.DefaultPageQuery>> = ({
    data,
    children,
}) => {
    const { colors } = parseData(data);

    return (
        <main>
            <PageColorStyle {...createPageColorStyleProps(colors)} />
            {children}
        </main>
    );
};

export default Page;

export const Head: HeadFC<Queries.DefaultPageQuery> = ({ data }) => {
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
    const title = ensure(mdx?.frontmatter?.title);
    const colors = parsePageColors(mdx?.frontmatter?.colors);

    return { title, colors };
};
