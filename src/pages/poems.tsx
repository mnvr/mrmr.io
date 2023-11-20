import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, PageProps, graphql, type HeadFC } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { paperDarkTheme } from "themes/themes";
import { ensure } from "utils/ensure";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/** Show a listing of all pages tagged "poem" */
const AllPage: React.FC<PageProps<Queries.PoemsPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    return (
        <main>
            <PageColorStyle {...paperDarkTheme} />
            <Column>
                <Title />
                <LinkStyleUnderlined>
                    <PageListing {...{ pages }} />
                    <Footer />
                </LinkStyleUnderlined>
            </Column>
        </main>
    );
};

export default AllPage;

export const Head: HeadFC = ({}) => {
    const titleSuffix = "Poems";
    const description = "Listing of all poems on mrmr.io";
    const canonicalPath = "/poems";

    return <DefaultHead {...{ titleSuffix, description, canonicalPath }} />;
};

/**
 * Fetch all pages tagged "poem", sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted`.
 */
export const query = graphql`
    query PoemsPage {
        allMdx(
            filter: {
                frontmatter: { tags: { in: "poem" }, unlisted: { ne: true } }
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
                    formattedDateMY: date(formatString: "MMM YYYY")
                }
                fields {
                    slug
                }
            }
        }
    }
`;

/** The parsed data for each page item that we show in the listing */
interface Page {
    title: string;
    slug: string;
    description?: string;
    formattedDateMY: string;
}

const parsePages = (data: Queries.PoemsPageQuery) => {
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
 * within the same calendar month are grouped. This grouping is done by
 * interspersing the original list of pages with strings representing the
 * section titles (the month + year).
 */
const sectionByMonth = (pages: Page[]): PageOrDate[] => {
    let currentDate: string | undefined;
    let result: PageOrDate[] = [];
    pages.forEach((page) => {
        if (page.formattedDateMY !== currentDate)
            result.push((currentDate = page.formattedDateMY));
        result.push(page);
    });
    return result;
};

const PageListing_ = styled.ul`
    margin-block-start: 2rem;

    list-style: none;
    padding-inline-start: 0;

    line-height: 1.2rem;

    a {
        border-bottom-width: 2px;
        font-weight: 600;
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
        </li>
    );
};

const Description = styled.span`
    font-family: serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--mrmr-color-3);
`;

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <Link to={"/"}>Home</Link>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    margin-block-start: 6rem;
    margin-block-end: 3rem;
    font-size: 0.8rem;
`;
