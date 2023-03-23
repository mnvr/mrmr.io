import { DefaultHead } from "components/Head";
import {
    basicColorPalettes,
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import BasicLayout from "layouts/basic";
import { ColorPalette, parseColorPalette } from "parsers/colors";
import { ParsedLink, parsePageLinks } from "parsers/links";
import * as React from "react";
import type { PageTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const PageTemplate: React.FC<
    PageProps<Queries.PageTemplateQuery, PageTemplateContext>
> = ({ data, children }) => {
    const page = parsePage(data);
    const colorPalettes = paletteSetOrFallback(page, basicColorPalettes);

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
                name
                page_links
            }
            fields {
                slug
                username
            }
        }
        mdx(id: { eq: $pageID }) {
            frontmatter {
                title
                date(formatString: "MMM YYYY")
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
    /** The date from the frontmatter, formatted as "Feb 2023" */
    formattedDateMY?: string;
    layout?: string;
    links?: ParsedLink[];
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    user: PageUser;
}

/**
 * A subset of information about the user that is needed when rendering
 * their pages.
 */
export interface PageUser {
    /** Slug for the user's home page */
    slug: string;
    /**
     * The name of the user whose post this is (this is _not_ the `username`,
     * this is their display name).
     */
    name?: string;
    /** Their username */
    username: string;
}

const parsePage = (data: Queries.PageTemplateQuery) => {
    const { user, mdx } = replaceNullsWithUndefineds(data);

    const title = ensure(mdx?.frontmatter?.title);
    const layout = mdx?.frontmatter?.layout;
    const formattedDateMY = mdx?.frontmatter?.date;
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    const pageLinks = mdx?.frontmatter?.links;
    const userPageLinks = user?.frontmatter?.page_links;
    const slug = ensure(mdx?.fields?.slug);
    const links = parsePageLinks(pageLinks, userPageLinks, slug);

    const userUsername = ensure(user?.fields?.username);
    const userSlug = ensure(user?.fields?.slug);
    const userDisplayName = user?.frontmatter?.name;

    return {
        title,
        layout,
        formattedDateMY,
        links,
        colors,
        darkColors,
        user: { slug: userSlug, name: userDisplayName, username: userUsername },
    };
};

/**
 * A variant of {@link parsePage} that bypasses the type safety.
 *
 * We need access to the page data in `gatsby-ssr.tsx`, but the `Queries`
 * namespaces is not visible there. So we export this method as a workaround -
 * it blindly assumes that the data we pass it has the correct shape.
 */
export const parsePageIgnoringTypeSafety = (data: Record<string, unknown>) =>
    parsePage(data as Queries.PageTemplateQuery) as Page;

/**
 * A context providing readonly access to the build time page data for use
 * within your components.
 */
export const BuildTimePageContext = React.createContext<Page | undefined>(
    undefined
);

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
            return <BasicLayout>{children}</BasicLayout>;
        default:
            return <>{children}</>;
    }
};
