import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import { PageColorStyle, paperColorPalettes } from "components/PageColorStyle";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** Show a listing of blog posts */
const BlogPage: React.FC<PageProps<Queries.BlogPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <main>
            <PageColorStyle {...paperColorPalettes} />
            <Column>
                <Title />
                <PageListing {...{ pages }} />
            </Column>
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
            filter: { frontmatter: { unlisted: { ne: true } } }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
            nodes {
                frontmatter {
                    title
                    description
                    formattedDateMY: date(formatString: "MMM YYYY")
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
        <Title_>
            <h1>all posts</h1>
        </Title_>
    );
};

const Title_ = styled.div`
    margin-block-start: 2rem;
    @media (min-width: 600px) {
        margin-block-start: 3rem;
    }

    h1 {
        font-family: serif;
        font-style: italic;
        opacity: 0.5;
    }
`;

/** The parsed data for each page item that we show in the listing */
interface Page {
    title: string;
    slug: string;
    description?: string;
    formattedDateMY: string;
}

const parsePages = (data: Queries.BlogPageQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { frontmatter, fields } = node;
        const slug = ensure(fields?.slug);

        const title = ensure(frontmatter?.title);
        const description = frontmatter?.description;
        const formattedDateMY = ensure(frontmatter?.formattedDateMY);

        return { slug, title, description, formattedDateMY };
    });
};

interface PageListingProps {
    /** The ordered list of pages to show */
    pages: Page[];
}

const PageListing: React.FC<PageListingProps> = ({ pages }) => {
    const pageOrDates = sectionByMonth(pages);
    return (
        <PageListing_>
            {pageOrDates.map((e) =>
                typeof e === "string" ? (
                    <SectionHeader key={e}>{e}</SectionHeader>
                ) : (
                    <PageItem key={e.slug} {...e} />
                ),
            )}
        </PageListing_>
    );
};

type PageOrDate = Page | string;

/**
 * Convert a linear list of pages into one where pages with a creation date
 * within the same calendar month are grouped together by interspersing the
 * original list of pages by strings representing the section titles (the month
 * name)
 */
const sectionByMonth = (pages: Page[]): PageOrDate[] => {
    let currentDate: string | undefined;
    let result: PageOrDate[] = [];
    pages.forEach((page) => {
        if (page.formattedDateMY !== currentDate)
            result.push((currentDate = page.formattedDateMY));
        result.push(page);
    });
    console.log(result);
    return result;
};

const PageListing_ = styled.ul`
    margin-block-start: 2rem;

    list-style: none;
    padding-inline-start: 0;

    line-height: 1.2rem;

    a {
        text-decoration: none;
        border-bottom: 2px solid blue;
        font-weight: 600;
    }

    li {
        /* margin-block: 1rem; */
    }
    li:nth-child(even) {
        a {
            border-bottom: 1px solid blue;
        }
    }
`;

const SectionHeader = styled.h4`
    font-style: italic;
    font-weight: 300;
    font-size: 0.7rem;
    opacity: 0.33;
    margin-block-end: 0rem;
`;

const PageItem: React.FC<Page> = ({ title, description, slug }) => {
    return (
        <li>
            <Link to={slug}>{title}</Link>.{" "}
            <Description>{description}</Description>
            {/* <br /> */}
            {/* <Date>Nov 2023, 780 words</Date> */}
        </li>
    );
};

const Description = styled.span`
    font-family: serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--mrmr-color-3);
    margin-bottom: 0;
    padding-bottom: 0;
`;

const Date = styled.span`
    font-family: serif;
    font-style: italic;
    font-size: 0.8rem;
    color: var(--mrmr-color-3);
    opacity: 0.7;
    margin-top: 0;
    padding-top: 0;
    line-height: 0.5rem;
`;
