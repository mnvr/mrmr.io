import { DefaultHead } from "components/Head";
import {
    basicColorPalettes,
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import BasicLayout from "layouts/basic";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import {
    createSourceLink,
    parsePageLinks,
    type ParsedLink,
} from "parsers/links";
import { descriptionOrFallback } from "parsers/page";
import { firstNameOrFallback } from "parsers/user";
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

export const Head: HeadFC<Queries.PageTemplateQuery, PageTemplateContext> = ({
    data,
}) => {
    const { title, description, slug } = parsePage(data);
    const canonicalPath = slug;

    const defaultFile = replaceNullsWithUndefineds(data.defaultPreviewFile);
    const file = data.file ? replaceNullsWithUndefineds(data.file) : undefined;
    const previewImagePath = getSrc(ensure(file ?? defaultFile));

    return (
        <DefaultHead
            {...{ title, description, canonicalPath, previewImagePath }}
        />
    );
};

export const query = graphql`
    query PageTemplate(
        $username: String!
        $pageID: String!
        $previewImageRelativePath: String!
    ) {
        defaultPreviewFile: file(
            relativePath: { eq: "default/preview.png" }
            sourceInstanceName: { eq: "assets" }
        ) {
            childImageSharp {
                gatsbyImageData
            }
        }
        file(
            relativePath: { eq: $previewImageRelativePath }
            sourceInstanceName: { eq: "users" }
        ) {
            childImageSharp {
                gatsbyImageData
            }
        }
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
                description
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
    /** The user whose page this is */
    user: PageUser;
    /** The page's slug */
    slug: string;
    /** Title of the page */
    title: string;
    /** A description (explicitly specified, or auto-generated) for the page */
    description: string;
    /** The date from the frontmatter, formatted as "Feb 2023" */
    formattedDateMY?: string;
    layout?: string;
    /** Resolved page links, including the sourceLink */
    links?: ParsedLink[];
    /** A link to the source of the page on GitHub */
    sourceLink: ParsedLink;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
}

/**
 * A subset of information about the user that is needed when rendering
 * their pages.
 */
export interface PageUser {
    /** The username of the person whose page this is */
    username: string;
    /** Slug for the user's home page */
    slug: string;
    /**
     * The name of the user whose post this is (this is _not_ the `username`,
     * this is their display name).
     */
    name?: string;
    /** The user's firstname */
    firstName: string;
}

const parsePage = (data: Queries.PageTemplateQuery): Page => {
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
    const sourceLink = createSourceLink(slug);

    const userUsername = ensure(user?.fields?.username);
    const userSlug = ensure(user?.fields?.slug);
    const userDisplayName = user?.frontmatter?.name;
    const userFirstName = firstNameOrFallback({
        username: userUsername,
        name: userDisplayName,
    });

    const description = descriptionOrFallback({
        username: userUsername,
        description: mdx?.frontmatter?.description,
    });

    const pageUser = {
        username: userUsername,
        slug: userSlug,
        name: userDisplayName,
        firstName: userFirstName,
    };

    return {
        user: pageUser,
        slug,
        title,
        description,
        layout,
        formattedDateMY,
        links,
        sourceLink,
        colors,
        darkColors,
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
    parsePage(data as Queries.PageTemplateQuery);

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
