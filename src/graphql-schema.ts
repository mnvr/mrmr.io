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
 Anything that is not explicitly listed here can be auto-deduced.

 References:
 https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/
*/

export const typeDefs = `
type Mdx implements Node {
    frontmatter: MdxFrontmatter
}

type MdxFrontmatter implements Node {
    hello: String
}
`;
