import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const Page: React.FC<PageProps<Queries.DefaultPageQuery>> = ({
    data,
    children,
}) => {
    const page = parseData(data);
    const colorPalettes = paletteSetOrFallback([page.colors, page.darkColors]);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
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
                dark_colors
            }
        }
    }
`;

const parseData = (data: Queries.DefaultPageQuery) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);
    const title = ensure(mdx?.frontmatter?.title);
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    return { title, colors, darkColors };
};
