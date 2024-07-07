/**
 Schema definition for our custom GraphQL types, primarily the MDX frontmatter

 Note: [GraphQL schema definition]

 Gatsby does automatic type inference, and does it quite well. However, it
 requires at least one of the MDX files to specify the field. This can work out
 fine in practice too (after all, if the field is not used by anyone, why does
 it even exist), but is a bit icky.

 Alternatively, we can provide the schema definition of our MDX frontmatter
 content. This also provides us a great place to put the related documentation.

 Note that we can do this in tandem with the automatic type inference too.
 Anything that is not explicitly listed here can be auto-deduced. However, there
 can be performance benefits to turning that off, so we've added the @dontInfer
 attribute to the MdxFrontmatter below.

 References:
 https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/
*/

export const typeDefs = `
type Mdx implements Node {
    frontmatter: MdxFrontmatter
}

type MdxFrontmatter implements Node @dontInfer {
    # Title of the page
    #
    # Required
    title: String!

    # -------- Rest everything is optional --------

    # The date the page was created.
    #
    # This is the field that is used to sort pages. By default, pages are
    # sorted in descending order of this date field whenever they're being
    # collected for listing.
    #
    # This field is also used by some pages to show by a date in their footers.
    #
    # The date format is "YYYY-MM-DD".
    #
    # If there are multiple pages with the same date, then they'll be sorted by
    # their titles. However, if we wish to force them to use some particular
    # order, we can alternatively use a longer date format that includes the
    # times to disambiguate between them and use the order we wish (the
    # fallback sort by title only happens if the date field is an exact match).
    #
    # This field is sort-of non-optional for normal pages, but it can be omitted
    # for unlisted pages (because unlisted pages don't usually need to get sorted
    # for listings).
    date: Date @dateformat(formatString: "YYYY-MM-DD")

    # A subtitle for the page.
    #
    # This is currently only used by the "text" layout to add a smaller
    # subtitle "caption" to go along with the title when rendering the header
    # at the top of the page.
    subtitle: String

    # A description for the page
    #
    # This will be used as the preview text when a link to the page is shown in
    # various page listings like "/all".
    #
    # It will also be used in the meta tags in the page header. e.g. this will
    # be shown as the subtitle if someone shares a link to this page on their
    # social media. However, in this case if a description is not provided then
    # the site's description (from "gatsby-config.json") will be used as the
    # fallback.
    description: String

    # A string to show instead of the formatted date when rendering the signoff
    # section of a page.
    #
    # If this is not provided, then we will generate one from the 'date'. As
    # such, this is useful for pages that wish to override it and show
    # something different that the autogenerated formatted date.
    formatted_signoff_date: String @proxy(from: "formatted-signoff-date")

    # The colors to use for the page.
    #
    # - If not specified, then a readable (dark/light mode aware) set of
    #   defaults will be used.
    # - If specified, then we need at least 2 values. The first one is the
    #   background, and the second one is the foreground.
    # - We can specify more too, up to 4, they'll be used for specific
    #   scenarios (e.g hover states).
    # - The color values can be specified in all ways they can be specified
    #   in CSS.
    colors: [String]

    # Optional variation of colors to use in dark mode.
    #
    # If specified, these will replace 'colors' when the user's browser is set
    # to prefer dark mode.
    dark_colors: [String] @proxy(from: "dark-colors")

    # The colors to use for tinting the default preview template image when
    # generating a preview image for this page.
    #
    # The preview image will only be generated if (a) these values are
    # specified, and (b) the page doesn't already have an associated preview
    # image (i.e. there is no "preview.png" or "preview.jpg" in the same
    # directory as the page).
    #
    # These colors should be given as plain RGB hex strings, e.g. "#ff0000".
    # They'll be passed to the sharp image library's duotone filter, so that's
    # the format that they need to adhere to.
    preview_image_highlight: String @proxy(from: "preview-image-highlight")
    preview_image_shadow: String @proxy(from: "preview-image-shadow")

    # Specify the color palette to use.
    #
    # This is an alternative way to specify colors by mentioning a named
    # palette set instead of listing the colors out one by one.
    #
    # See theme.ts for available color themes.
    #
    # If not specified, and the colors are also not specified, then the
    # "default" theme is used.
    theme: String

    # Override just the highlight color
    #
    # By default, the highlight color is taken as the fifth color in the array
    # of colors that define a palette (if the page uses explicitly specified
    # colors), or comes from the theme (if the page uses a theme). However,
    # sometimes it is convenient for a page to keep the rest of the colors the
    # same (say, use a predefined color palette from a theme) but just provide a
    # custom highlight color.
    #
    # This property allows a page to do that. There is also a dark mode variant
    # that can be specified (if the dark mode highlight should be different).
    highlight_color: String @proxy(from: "highlight-color")
    highlight_color_dark: String @proxy(from: "highlight-color-dark")

    # Set this to true to prevent this page from showing up in the site wide
    # listings, e.g. '/all' or '/notes'.
    unlisted: Boolean

    # Set this to true to prevent search engines from indexing the page.
    #
    # This causes the "noindex" meta tag to the be added to the generated HTML
    # for the page to prevent it from being indexed by search engines. This can
    # be useful, e.g., when we have non-deterministic or dynamically generated
    # content, say like the '/quotes' page.
    noindex: Boolean

    # Specify a layout to use.
    #
    # By default, the minimal CSS resets are made (primarily, setting the body
    # margin to 0), and the colors are setup. Then the MDX is rendered as is.
    #
    # The intent is that customization should be done inside out, by
    # abstracting away the customizations in 'src/components/' and importing
    # them in the MDX.
    #
    # Still, should one need to, there is also the option of a more
    # conventional outside-in customization using a layout.
    #
    # See 'src/layouts/' for supported layouts. Currently, the following exist:
    # - text
    # - code
    layout: String

    # Specify one or more attributes of the page.
    #
    # Note: [List of supported page attributes]
    #
    # - "front-page"
    #   This page will be shown in the home (front page) listing.
    #
    # - "poem"
    #   This page will be shown in the /poems listing
    #
    # - "hindi"
    #   This page contents are in Hindi.
    #
    # - "bumped"
    #   Move this page to the top of the listing for that month.
    #
    attributes: [String]

    # Specify the slugs of related pages.
    #
    # Some layouts show this list to show links to these related pages in the
    # footer of the page.
    #
    # Data type is list of strings. Default is empty.
    related: [String]
}
`;
