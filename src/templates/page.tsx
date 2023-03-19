import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import BasicLayout from "layouts/basic";
import { parseColorPalette } from "parsers/colors";
import * as React from "react";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const PageTemplate: React.FC<PageProps<Queries.PageTemplateQuery>> = ({
    data,
    children,
}) => {
    const { layout, colors, darkColors } = parseData(data);
    const colorPalettes = paletteSetOrFallback([colors, darkColors]);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <Layout layout={layout}>{children}</Layout>
        </main>
    );
};

export default PageTemplate;

export const Head: HeadFC<Queries.PageTemplateQuery> = ({ data }) => {
    const { title } = parseData(data);

    return <DefaultHead title={title} />;
};

export const query = graphql`
    query PageTemplate($id: String!) {
        mdx(id: { eq: $id }) {
            frontmatter {
                title
                layout
                colors
                dark_colors
            }
        }
    }
`;

const parseData = (data: Queries.PageTemplateQuery) => {
    const mdx = replaceNullsWithUndefineds(data.mdx);
    const title = ensure(mdx?.frontmatter?.title);
    const layout = mdx?.frontmatter?.layout;
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    return { title, layout, colors, darkColors };
};

interface LayoutProps {
    layout?: string;
}

/** Wrap the children in a layout if one is specified in the frontmatter */
const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
    layout,
    children,
}) => {
    switch (layout) {
        case "basic":
            return <BasicLayout>{children}</BasicLayout>;
        default:
            return <>{children}</>;
    }
};
