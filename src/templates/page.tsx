import { DefaultHead } from "components/Head";
import {
    basicColorPalettes,
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc, type ImageDataLike } from "gatsby-plugin-image";
import BasicLayout from "layouts/basic";
import BlogPostLayout from "layouts/blog";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
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
                sourceInstanceName: { eq: "pages" },
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
        mp3s: allFile(
            filter: {
                sourceInstanceName: { eq: "pages" },
                relativeDirectory: { eq: $relativeDirectory }
                ext: { eq: ".mp3" }
            }
        ) {
            nodes {
                name
                publicURL
            }
        }
        mdx(id: { eq: $pageID }) {
            frontmatter {
                title
                description
                formattedDateMY: date(formatString: "MMM YYYY")
                formattedDateDMY: date(formatString: "DD MMMM YYYY")
                layout
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
    /**
     * Public URLs for MP3 files stored in the same directory as the page
     *
     * These are indexed by the name of the file; precisely, the filename
     * without the extension. e.g. the file name will be "w1" for "w1.mp3".
     */
    mp3s: Record<string, string>;
}

const parsePage = (data: Queries.PageTemplateQuery): Page => {
    const { mdx, images, mp3s } = replaceNullsWithUndefineds(data);

    const title = ensure(mdx?.frontmatter?.title);
    const layout = mdx?.frontmatter?.layout;
    const formattedDateMY = mdx?.frontmatter?.formattedDateMY;
    const formattedDateDMY = mdx?.frontmatter?.formattedDateDMY;
    const colors = parseColorPalette(mdx?.frontmatter?.colors);
    const darkColors = parseColorPalette(mdx?.frontmatter?.dark_colors);

    const slug = ensure(mdx?.fields?.slug);

    const description = descriptionOrFallback(mdx?.frontmatter?.description);

    // Gatsby's `StaticImage` component currently doesn't support paths that are
    // outside the `src` directory. Our user pages live in the top-level `pages`
    // directory, which is outside `src`; thus we cannot use `StaticImage` for
    // the images on the content pages.
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

    // Get at the publicURLs for all the MP3 files that are stored in the same
    // directory as the page that we're rendering. Put them in a map, indexed by
    // the name of the file (without the extension).
    const pageMP3s: Record<string, string> = {};
    mp3s.nodes.forEach((node) => {
        pageMP3s[node.name] = ensure(node.publicURL);
    });

    return {
        slug,
        title,
        description,
        layout,
        formattedDateMY,
        formattedDateDMY,
        colors,
        darkColors,
        images: pageImages,
        mp3s: pageMP3s,
    };
};

/**
 * If the given page-like object has a description, return that. Otherwise
 * create and return a fallback description.
 */
const descriptionOrFallback = (description?: string) => {
    if (description) return description;
    return `Music, words and art by Manav`;
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
    undefined,
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
        case "blog":
            return <BlogPostLayout>{children}</BlogPostLayout>;
        default:
            return <>{children}</>;
    }
};
