import { DefaultHead } from "components/Head";
import {
    basicColorPalettes,
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc, type ImageDataLike } from "gatsby-plugin-image";
import BasicLayout from "layouts/basic";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import {
    createSourceLink,
    createUserPageLink,
    parsePageLinks,
    type ParsedLink,
    type ParsedSlug,
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
    const { title, description, slug, images } = parsePage(data);
    const canonicalPath = slug;

    const defaultFile = replaceNullsWithUndefineds(data.defaultPreviewFile);
    const previewImagePath = getSrc(ensure(images["preview"] ?? defaultFile));

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
        $relativeDirectory: String!
    ) {
        defaultPreviewFile: file(
            sourceInstanceName: { eq: "assets" }
            relativePath: { eq: "default/preview.png" }
        ) {
            childImageSharp {
                gatsbyImageData
            }
        }
        images: allFile(
            filter: {
                sourceInstanceName: { eq: "users" },
                relativeDirectory: { eq: $relativeDirectory }
                ext: { regex: "/\\.(jpg|png)/" }
            }
        ) {
            nodes {
                name
                childImageSharp {
                    gatsbyImageData
                }
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
                formattedDateMY: date(formatString: "MMM YYYY")
                formattedDateDMY: date(formatString: "DD MMMM YYYY")
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

/** A type describing the page data that the page template passes to layouts */
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
    /** The date from the frontmatter, formatted as "17 February 2023" */
    formattedDateDMY?: string;
    layout?: string;
    /** Resolved links */
    links: Links;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    /**
     * ImageSharp nodes for images stored in the same directory as the page
     *
     * These are indexed by the name of the image. The image name is the
     * filename without the extension (e.g. the image name will be "preview" for
     * "preview.png").
     *
     * The values in this dictionary can then be passed to various Gatsby Image
     * helper functions like `getImage` or `getSrc`.
     * https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#helper-functions
     */
    images: Record<string, ImageDataLike>;
}

/** A container for various links related to the page */
export interface Links {
    /**
     * Page links (see description of the `links` frontmatter property).
     *
     * This'll include the sourceLink if there is no other link to GitHub in the
     * resolved page links.
     */
    pageLinks?: ParsedLink[];
    /** A link to the source of the page on GitHub */
    sourceLink: ParsedLink;
    /** A (relative) link to the user's home page */
    userPageLink: ParsedSlug;
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
    const { user, mdx, images } = replaceNullsWithUndefineds(data);

    const title = ensure(mdx?.frontmatter?.title);
    const layout = mdx?.frontmatter?.layout;
    const formattedDateMY = mdx?.frontmatter?.formattedDateMY;
    const formattedDateDMY = mdx?.frontmatter?.formattedDateDMY;
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    const slug = ensure(mdx?.fields?.slug);
    const pageLinks = parsePageLinks(
        mdx?.frontmatter?.links,
        user?.frontmatter?.page_links,
        slug
    );
    const sourceLink = createSourceLink(slug);

    const userUsername = ensure(user?.fields?.username);
    const userSlug = ensure(user?.fields?.slug);
    const userDisplayName = user?.frontmatter?.name;
    const userish = {
        username: userUsername,
        name: userDisplayName,
        slug: userSlug,
    };

    const userFirstName = firstNameOrFallback(userish);
    const userPageLink = createUserPageLink(userish);

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

    const links = {
        pageLinks,
        sourceLink,
        userPageLink,
    };

    // Gatsby's `StaticImage` component currently doesn't support paths that are
    // outside the `src` directory. Our user pages live in the top-level `users`
    // directory, which is outside `src`; thus we cannot use `StaticImage` for
    // the images on the user pages.
    //
    // As an alternative, we read the Gatsby ImageSharp node data (the
    // `ImageDataLike` values in this dictionary) for all the images that are in
    // the same directory as our page. We can then index this dictionary by name
    // to easily obtain a value that can then be passed to the dynamic
    // `GatsbyImage` component.
    const pageImages: Record<string, ImageDataLike> = {};
    images.nodes.forEach((node) => {
        pageImages[node.name] = node;
    });

    return {
        user: pageUser,
        slug,
        title,
        description,
        layout,
        formattedDateMY,
        formattedDateDMY,
        links,
        colors,
        darkColors,
        images: pageImages,
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
