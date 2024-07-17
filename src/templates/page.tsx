import { MDXProvider } from "@mdx-js/react";
import { ExternalLinkWithIcon } from "components/ExternalLink";
import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc, type ImageDataLike } from "gatsby-plugin-image";
import CodeLayout from "layouts/code";
import TextLayout from "layouts/text";
import TextHindiLayout from "layouts/text-hindi";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import * as React from "react";
import { allThemes, defaultTheme } from "themes/themes";
import type { PageTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const PageTemplate: React.FC<
    PageProps<Queries.PageTemplateQuery, PageTemplateContext>
> = ({ data, children }) => {
    const page = parsePage(data);
    const colorPalettes = paletteSetOrFallback(
        page,
        page.theme ? allThemes[page.theme] : undefined,
        defaultTheme,
    );

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <Layout page={page}>
                <MDXProvider components={{ a: customA }}>
                    {children}
                </MDXProvider>
            </Layout>
        </main>
    );
};

export default PageTemplate;

export const Head: HeadFC<Queries.PageTemplateQuery, PageTemplateContext> = ({
    data,
}) => {
    const { title, description, slug, images, generatedPreviewImage } =
        parsePage(data);
    const canonicalPath = slug;

    const previewImagePath = getSrc(
        ensure(
            images["preview"] ??
                generatedPreviewImage ??
                replaceNullsWithUndefineds(data.defaultPreviewImage),
        ),
    );

    return (
        <DefaultHead
            {...{
                title,
                description,
                canonicalPath,
                previewImagePath,
            }}
        />
    );
};

export const query = graphql`
    query PageTemplate(
        $pageID: String!
        $relativeDirectory: String!
        $previewImageHighlight: String!
        $previewImageShadow: String!
    ) {
        defaultPreviewImage: file(
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
        allMdx {
            nodes {
                frontmatter {
                    title
                }
                fields {
                    slug
                }
            }
        }
        mdx(id: { eq: $pageID }) {
            frontmatter {
                title
                subtitle
                description
                formattedDateMY: date(formatString: "MMM YYYY")
                formattedDateDMY: date(formatString: "DD MMMM YYYY")
                formatted_signoff_date
                layout
                colors
                dark_colors
                theme
                highlight_color
                highlight_color_dark
                attributes
            }
            fields {
                slug
            }
            generatedPreviewImage: previewImageTemplate {
                gatsbyImageData(
                    transformOptions: {duotone: {highlight: $previewImageHighlight, shadow: $previewImageShadow}}
                  )
            }
        }
    }
`;

/**
 * Named layouts
 *
 * These are defined in `src/layouts`.
 */
export type LayoutName = "text" | "code";

const isLayoutName = (s: string): s is LayoutName => {
    return s === "text" || s === "code";
};

const ensureLayoutNameIfDefined = (s: string | undefined) => {
    if (s === undefined) return undefined;
    if (!isLayoutName(s)) throw new Error(`Invalid layout name ${s}`);
    return s;
};

/**
 * A type describing the page data that the page template passes to layouts.
 *
 * For more detailed description of the corresponding fields (if any) in the MDX
 * frontmatter, See: Note: [GraphQL schema definition].
 */
export interface Page {
    /** The page's slug */
    slug: string;
    /** Title of the page */
    title: string;
    /** An (optional) subtitle for the page */
    subtitle?: string;
    /** The (frontmatter) description of the page */
    description?: string;
    /** The date from the frontmatter, formatted as "Feb 2023" */
    formattedDateMY?: string;
    /** The date from the frontmatter, formatted as "17 February 2023" */
    formattedDateDMY?: string;
    /**
     * The date string to show in the signoff section.
     *
     * By default, this is the same as {@link formattedDateMY}. However, a page
     * can choose to override and directly specify this if it wishes by setting
     * the "signoff-date" field in the frontmatter.
     */
    formattedSignoffDate?: string;
    layout?: LayoutName;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    /**
     * An alternative way of specifying colors / darkColors as named palette
     * sets instead of specifying the individual colors.
     */
    theme?: string;
    /**
     * A way to override just the highlight color.
     */
    highlightColor?: string;
    highlightColorDark?: string;
    /**
     * A list of (possibly empty) attributes for the page.
     *
     * This list is populated from the "attributes" field in the frontmatter.
     * See: Note: [List of supported page attributes].
     */
    attributes: string[];
    /**
     * A preview image generated from a template using tint colors
     *
     * This will be generated if the "preview-image-highlight" and
     * "preview-image-shadow" colors are specified in the MDX frontmatter. These
     * colors (RGB hex strings like "#ff0000") will be used to generate a
     * preview image by tinting the default preview image.
     *
     * See: Note: [Generating preview images].
     */
    generatedPreviewImage?: ImageDataLike;
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

export const parsePage = (data_: Queries.PageTemplateQuery): Page => {
    const data = replaceNullsWithUndefineds(data_);
    const { mdx, images, mp3s } = data;

    const frontmatter = mdx?.frontmatter;
    const title = ensure(frontmatter?.title);
    const description = frontmatter?.description;
    const subtitle = frontmatter?.subtitle;
    const layout = ensureLayoutNameIfDefined(frontmatter?.layout);
    const formattedDateMY = frontmatter?.formattedDateMY;
    const formattedDateDMY = frontmatter?.formattedDateDMY;
    const colors = parseColorPalette(frontmatter?.colors);
    const darkColors = parseColorPalette(frontmatter?.dark_colors);
    const theme = frontmatter?.theme;
    const highlightColor = frontmatter?.highlight_color;
    const highlightColorDark = frontmatter?.highlight_color_dark;
    const attributes =
        frontmatter?.attributes?.filter((x) => x !== undefined) ?? [];

    const formattedSignoffDate =
        frontmatter?.formatted_signoff_date ?? formattedDateMY;

    const slug = ensure(mdx?.fields?.slug);

    const generatedPreviewImage = mdx?.generatedPreviewImage;

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
        subtitle,
        description,
        layout,
        formattedDateMY,
        formattedDateDMY,
        formattedSignoffDate,
        colors,
        darkColors,
        theme,
        highlightColor,
        highlightColorDark,
        attributes,
        generatedPreviewImage,
        images: pageImages,
        mp3s: pageMP3s,
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
    undefined,
);

interface LayoutProps {
    page: Page;
}

/** Wrap the children in a layout if one is specified in the frontmatter */
export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
    page,
    children,
}) => {
    switch (page.layout) {
        case "text":
            return page.attributes.includes("hindi") ? (
                <TextHindiLayout>{children}</TextHindiLayout>
            ) : (
                <TextLayout>{children}</TextLayout>
            );
        case "code":
            return <CodeLayout>{children}</CodeLayout>;
        default:
            return <>{children}</>;
    }
};

/**
 * The custom anchor (`<a>`) tag that is used for links in the mdx content.
 *
 * This a tag is provide to MDX via the MDXProvider. MDX then uses this tag
 * instead of the default a tag whenever it needs one. This gives us a hook to
 * customize the generated links in the rendered HTML.
 *
 * In particular, we use this to convert (all) links to our custome external
 * links component. This component converts the links to open in a new tag, and
 * adds an appropriate arrow icon too.
 *
 * Why all links? As in, doing this for external only links is one option.
 * However, even internal links break the flow of the reader. While I try to use
 * them sparingly thus, sometimes they're still needed, so to avoid breaking the
 * reading flow they too get the external treatment.
 *
 * Since this only acts on links in the MDX content, normal navigation links
 * like those in the footer etc remain unaffected.
 *
 * There currently isn't a good escape hatch, except writing that particular
 * snippet of content as a custom component instead of in as a Markdown link
 * (importing and using the {@link Link} component from "gatsby" is one handy
 * way to do this). MDX only transforms raw markdown content, so links in any
 * regular non-markdown React components, even if they're then used within the
 * MDX, remain unaffected.
 *
 * ---
 *
 * An unrelated issue is the TypeScript type for `customA`. Ideally, we should
 * be able to write
 *
 *     const customA = ExternalLinkWithIcon
 *
 * In fact, we wouldn't even need this separate customA component then (though
 * it still might be useful as a place to put the above documentation).
 *
 * However, the above causes TypeScript to complain about the types. The issue
 * is that React.FC does not return a ReactNode:
 *
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
 *
 * I don't fully understand how that's playing out here, but the workaround
 * mentioned in some of the comments there - explicitly typing the props instead
 * of using React.FC - works. Another workaround mentioned there that would've
 * alternatively used was to wrap the return value of `customA` in a fragment.
 */
const customA = (
    props: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    >,
) => {
    return <ExternalLinkWithIcon {...props} />;
};
