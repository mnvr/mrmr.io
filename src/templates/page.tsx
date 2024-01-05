import { DefaultHead } from "components/Head";
import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { graphql, type HeadFC, type PageProps } from "gatsby";
import { getSrc, type ImageDataLike } from "gatsby-plugin-image";
import TextLayout from "layouts/text";
import TextHindiLayout from "layouts/text-hindi";
import { parseColorPalette, type ColorPalette } from "parsers/colors";
import * as React from "react";
import { allThemes, defaultTheme } from "themes/themes";
import type { PageTemplateContext } from "types/gatsby";
import { filterDefined } from "utils/array";
import { isHindiContent } from "utils/attributes";
import { ensure } from "utils/ensure";
import {
    replaceNullsWithUndefineds,
    type RecursivelyReplaceNullWithUndefined,
} from "utils/replace-nulls";
import { capitalize } from "utils/string";

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
            <Layout page={page}>{children}</Layout>
        </main>
    );
};

export default PageTemplate;

export const Head: HeadFC<Queries.PageTemplateQuery, PageTemplateContext> = ({
    data,
}) => {
    const { title, description, slug, noIndex, images, generatedPreviewImage } =
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
                noIndex,
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
                    related
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
                noindex
                layout
                colors
                dark_colors
                theme
                attributes
                tags {
                    label
                    tag {
                        tag
                        fields {
                            slug
                        }
                    }
                }
                related
            }
            fields {
                slug
                feed
            }
            generatedPreviewImage: previewImageTemplate {
                gatsbyImageData(
                    transformOptions: {duotone: {highlight: $previewImageHighlight, shadow: $previewImageShadow}}
                  )
            }
        }
    }
`;

export type FeedType = "/all" | "/notes";

const isFeedType = (s: string): s is FeedType => {
    return s === "/all" || s === "/notes";
};

const parseFeedType = (s: string | undefined) =>
    s && isFeedType(s) ? s : undefined;

/**
 * A type describing the page data that the page template passes to layouts.
 *
 * For more detailed description of the corresponding fields (if any) in the MDX
 * frontmatter, See: Note: [GraphQL schema definition].
 */
export interface Page {
    /** The page's slug */
    slug: string;
    /** The feed that this page is classified under */
    feed?: FeedType;
    /** Title of the page */
    title: string;
    /** An (optional) subtitle for the page */
    subtitle?: string;
    /** A description (explicitly specified, or auto-generated) for the page */
    description: string;
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
    /**
     * If true, then we add the "noindex" meta tag to the head of the page to
     * prevent search engines from indexing the page.
     *
     * See the documentation of the {@link noIndex} field in the props for
     * {@link DefaultHead} for more discussion about what that does.
     */
    noIndex: boolean;
    layout?: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    /**
     * An alternative way of specifying colors / darkColors as named palette
     * sets instead of specifying the individual colors.
     */
    theme?: string;
    /**
     * A list of (possibly empty) attributes for the page.
     *
     * This list is populated from the "attributes" field in the frontmatter.
     * See: Note: [List of supported page attributes].
     */
    attributes: string[];
    /**
     * A list of (possibly empty) tags for the page.
     *
     * This list is populated from the "tags" field in the frontmatter.
     */
    tags: FrontmatterTag[];
    /**
     * A list of (links to) related pages.
     *
     * This list is populated from the slugs specified in the "related" field
     * from the frontmatter.
     */
    relatedPageLinks: PageLink[];
    /**
     * A list of backlinks to pages that link here via the related field.
     *
     * i.e. these are the pages whose {@link relatedPageLinks} link here.
     */
    linkedFromPageLinks: PageLink[];
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

/** The slug to a page, and a title to show in the anchor tag */
export interface PageLink {
    slug: string;
    title: string;
}

/**
 * A tag in the frontmatter
 *
 * For more details, see the documentation for thee `MdxFrontmatterTag` GraphQL
 * type defined in `graphql-schema.ts`.
 */
export interface FrontmatterTag {
    /** The label to show for the tag. This can be an arbitrary string. */
    label: string;
    /**
     * If this tag is one of the predefined ones in `data/tags.yaml`, then
     * this'll contain the slug from the corresponding {@link Tag} structure.
     */
    slug?: string;
}

export const parsePage = (data_: Queries.PageTemplateQuery): Page => {
    const data = replaceNullsWithUndefineds(data_);
    const { mdx, images, mp3s } = data;

    const frontmatter = mdx?.frontmatter;
    const title = ensure(frontmatter?.title);
    const subtitle = frontmatter?.subtitle;
    const layout = frontmatter?.layout;
    const formattedDateMY = frontmatter?.formattedDateMY;
    const formattedDateDMY = frontmatter?.formattedDateDMY;
    const noIndex = frontmatter?.noindex ?? false;
    const colors = parseColorPalette(frontmatter?.colors);
    const darkColors = parseColorPalette(frontmatter?.dark_colors);
    const theme = frontmatter?.theme;
    const attributes = filterDefined(frontmatter?.attributes);

    const tags = filterDefined(frontmatter?.tags).map(({ label, tag }) => {
        if (label === undefined && tag === undefined)
            throw new Error(
                `Obtained a tag without either label or tag: ${frontmatter}`,
            );
        if (!label) label = capitalize(ensure(tag).tag);
        const slug = tag?.fields?.slug;
        return { label, slug };
    });

    const formattedSignoffDate =
        frontmatter?.formatted_signoff_date ?? formattedDateMY;

    const slug = ensure(mdx?.fields?.slug);
    const feed = parseFeedType(mdx?.fields?.feed);

    const description = descriptionOrFallback(frontmatter?.description);

    const generatedPreviewImage = mdx?.generatedPreviewImage;

    const { relatedPageLinks, linkedFromPageLinks } = parsePageLinks(data);

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
        feed,
        title,
        subtitle,
        description,
        layout,
        formattedDateMY,
        formattedDateDMY,
        formattedSignoffDate,
        noIndex,
        colors,
        darkColors,
        theme,
        attributes,
        tags,
        relatedPageLinks,
        linkedFromPageLinks,
        generatedPreviewImage,
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
    return `Words, music and art by Manav`;
};

/**
 * Return two sets of links - pages that are related to us, and the pages that
 * link to us.
 */
const parsePageLinks = (
    data: RecursivelyReplaceNullWithUndefined<Queries.PageTemplateQuery>,
) => {
    // This really only needs the mdx and allMdx fields, but there doesn't seem
    // to be a way to get at the TypeScript types of the named nested parts of
    // the PageTemplateQuery, so we just pass the entire thing over to us.
    const { mdx, allMdx } = data;

    // To obtain the titles corresponding to related pages, we need to join
    // using the slugs of related pages (if any) specified in the frontmatter of
    // this page. There might be better (but more involved) ways of doing this:
    // for now we just fetch the list of all pages and do the join here in code.
    //
    // In a very crude benchmark (`time yarn build`) done after the initial
    // implementation,  this doesn't seem to have made any noticeable
    // difference. But if we run into performance issues when the number of
    // pages grows, this might be a possible thing to consider optimizing (e.g.
    // using the @link Gatsby extension for foreign-key fields in GraphQL).

    const relatedPageLinks: PageLink[] = [];
    const linkedFromPageLinks: PageLink[] = [];

    // The number of related links is expected to be small (a few at max), so we
    // just iterate over these O(n^2) lists instead of indexing them into a maps
    // first.

    const mySlug = ensure(mdx?.fields?.slug);

    mdx?.frontmatter?.related?.forEach((relatedSlug) => {
        relatedSlug &&
            allMdx.nodes?.forEach((n) => {
                if (n.fields?.slug === relatedSlug) {
                    if (n.frontmatter?.related?.includes(mySlug))
                        throw new Error(
                            `Bidirectional links are not allowed: The page ${relatedSlug} links to ${mySlug} and vice versa.`,
                        );

                    relatedPageLinks.push({
                        slug: relatedSlug,
                        title: ensure(n.frontmatter?.title),
                    });
                }
            });
    });

    allMdx.nodes?.forEach((node) => {
        const nodeSlug = ensure(node.fields?.slug);
        nodeSlug !== mySlug &&
            node.frontmatter?.related?.forEach((relatedSlug) => {
                if (relatedSlug === mySlug) {
                    linkedFromPageLinks.push({
                        slug: nodeSlug,
                        title: ensure(node.frontmatter?.title),
                    });
                }
            });
    });

    return { relatedPageLinks, linkedFromPageLinks };
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
            return isHindiContent(page) ? (
                <TextHindiLayout>{children}</TextHindiLayout>
            ) : (
                <TextLayout>{children}</TextLayout>
            );
        default:
            return <>{children}</>;
    }
};
