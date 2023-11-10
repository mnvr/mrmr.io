import { DefaultHead } from "components/Head";
import { PageColorStyle, paperColorPalettes } from "components/PageColorStyle";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import React from "react";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** Show a listing of blog posts */
const BlogPage: React.FC<PageProps<Queries.BlogPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <main>
            <PageColorStyle {...paperColorPalettes} />
            <Title />
            <PageListing {...{ pages }} />
        </main>
    );
};

export default BlogPage;

export const Head: HeadFC = ({}) => {
    const titleSuffix = "blog";
    const description = "Listing of all blog posts on mrmr.io";
    const canonicalPath = "/blog";

    return <DefaultHead {...{ titleSuffix, description, canonicalPath }} />;
};

/**
 * Fetch all pages with tagged "blog", sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted` (e.g. the "_example" page).
 * - Right now this returns all pages; if this list grows too big then we can
 *   add a limit here.
 */
export const query = graphql`
    query BlogPage {
        allMdx(
            filter: {
                frontmatter: {
                    tags: { in: "blog" }
                    unlisted: { ne: true }
                }
            }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    title
                    description
                }
                fields {
                    slug
                }
            }
        }
    }
`;

const Title: React.FC = () => {
    return (
        <div>
            <h2>blog</h2>
        </div>
    );
};

/** The parsed data for each page item that we show in the listing */
interface Page {
    title: string;
    slug: string;
    description?: string;
}

const parsePages = (data: Queries.BlogPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const description = frontmatter?.description;

        return { title, slug, description };
    });
};

interface PageListingProps {
    /** The ordered list of pages to show */
    pages: Page[];
}

const PageListing: React.FC<PageListingProps> = ({ pages }) => {
    const n = pages.length;
    return (
        <div>
            {pages.map((page) => (
                <PageItem key={page.slug} {...page} />
            ))}
        </div>
    );
};

const PageItem: React.FC<Page> = ({ title, description, slug }) => {
    return (
        <div>
            <p>
                <Link to={slug}>{title}</Link>
            </p>
            <p>{description}</p>
        </div>
    );
};
