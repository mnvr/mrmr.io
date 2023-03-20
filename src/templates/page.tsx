import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import BasicLayout from "layouts/basic";
import { ColorPalette, parseColorPalette } from "parsers/colors";
import { ParsedLink, parsePageLinks } from "parsers/links";
import * as React from "react";
import { type PageTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const PageTemplate: React.FC<
    PageProps<Queries.PageTemplateQuery, PageTemplateContext>
> = ({ data, children }) => {
    const page = parsePage(data);
    const colorPalettes = paletteSetOrFallback([page.colors, page.darkColors]);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <Layout page={page}>{children}</Layout>
        </main>
    );
};

export default PageTemplate;

export const Head: HeadFC<Queries.PageTemplateQuery> = ({ data }) => {
    const { title } = parsePage(data);

    return <DefaultHead title={title} />;
};

export const query = graphql`
    query PageTemplate($username: String!, $pageID: String!) {
        user: mdx(
            fields: { type: { eq: "user" }, username: { eq: $username } }
        ) {
            frontmatter {
                page_links
            }
        }
        mdx(id: { eq: $pageID }) {
            frontmatter {
                title
                layout
                links
                colors
                dark_colors
            }
            fields {
                slug
            }
        }
    }
`;

/** A type describing the page data is the page template passes to layouts */
export interface Page {
    title: string;
    layout?: string;
    links?: ParsedLink[];
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

const parsePage = (data: Queries.PageTemplateQuery) => {
    const { user, mdx } = replaceNullsWithUndefineds(data);

    const title = ensure(mdx?.frontmatter?.title);
    const layout = mdx?.frontmatter?.layout;
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    const pageLinks = mdx?.frontmatter?.links;
    const userPageLinks = user?.frontmatter?.page_links;
    const slug = ensure(mdx?.fields?.slug);
    const links = parsePageLinks(pageLinks, userPageLinks, slug);

    return { title, layout, links, colors, darkColors };
};

interface LayoutProps {
    page: Page;
}

/** Wrap the children in a layout if one is specified in the frontmatter */
const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
    page,
    children,
}) => {
    switch (page.layout) {
        case "basic":
            return <BasicLayout page={page}>{children}</BasicLayout>;
        default:
            return <>{children}</>;
    }
};
