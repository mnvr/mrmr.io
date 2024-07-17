import { WideColumn } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, graphql } from "gatsby";
import React from "react";
import styled from "styled-components";
import { paperDarkTheme } from "themes/themes";
import { filterDefined } from "utils/array";
import { ensure } from "utils/ensure";
import { type RecursivelyReplaceNullWithUndefined } from "utils/replace-nulls";

interface PageListingContentProps {
    /** The ordered list of pages to show */
    pages: PageListingPage[];
    /**
     * Optional extra content to show in the footer
     *
     * The footer always shows the "Home" link. This React node is shown above
     * it. Generally, it'll be one or more extra links we want to show. If
     * that's what you're trying to do, embed each link in a <div /> to get the
     * styling to work properly, and wrap them all in a fragment that is passed
     * as this property.
     */
    extraLinks?: React.ReactNode;
}

/** The parsed data for each page item that we show in the listing */
export interface PageListingPage {
    title: string;
    slug: string;
    description?: string;
    formattedDateMY: string;
    attributes: string[];
}

/**
 * The main content of an generic listing page
 *
 * This provides the main content body of a page that shows a listing of some
 * links to some pages. It takes as input the list of parsed pages to show in
 * the listing. The children are shown in the title spot.
 *
 * This is somewhere between a full blown template and a bunch of components for
 * almost identical looking listings that differ slightly in the types of pages
 * they show etc.
 */
const PageListingContent: React.FC<
    React.PropsWithChildren<PageListingContentProps>
> = ({ pages, extraLinks, children }) => {
    return (
        <main>
            <PageColorStyle {...paperDarkTheme} />
            <WideColumn>
                <Title>{children}</Title>
                <LinkStyleUnderlined>
                    <PageListing {...{ pages }} />
                    <Footer>{extraLinks}</Footer>
                </LinkStyleUnderlined>
            </WideColumn>
        </main>
    );
};

export default PageListingContent;

const Title: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Title_>
            <h1>{children}</h1>
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
    }
`;

interface PageListingProps {
    /** The ordered list of pages to show */
    pages: PageListingPage[];
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

type PageOrDate = PageListingPage | string;

/**
 * Convert a linear list of pages into one where pages with a creation date
 * within the same calendar month are grouped. This grouping is done by
 * interspersing the original list of pages with strings representing the
 * section titles (the month + year).
 */
const sectionByMonth = (pages: PageListingPage[]): PageOrDate[] => {
    let currentDate: string | undefined;
    let result: PageOrDate[] = [];
    let bumpSlot = 0;
    pages.forEach((page) => {
        if (page.formattedDateMY !== currentDate) {
            bumpSlot = result.length;
            result.push((currentDate = page.formattedDateMY));
        }
        result.push(page);
    });

    return result;
};

const PageListing_ = styled.ul`
    margin-block-start: 2rem;

    list-style: none;
    padding-inline-start: 0;

    a {
        border-bottom-width: 2px;
        font-weight: 600;
    }

    li {
        line-height: 1.6rem;
    }
`;

const SectionHeader = styled.li`
    font-style: italic;
    font-weight: 300;
    font-size: 0.7rem;
    opacity: 0.33;

    /* Empty space before each date to give a section-ed feeling  */
    margin-block-start: 2rem;
`;

const PageItem: React.FC<PageListingPage> = (page) => {
    const { title, description, slug } = page;
    return (
        <PageItemLI>
            <Link to={slug}>{title}</Link>
            {description && (
                <Description>
                    {" – "}
                    {description}
                </Description>
            )}
        </PageItemLI>
    );
};

const PageItemLI = styled.li`
    /* Add 2px of bottom margin to visually account for the 2px bottom-border
     * of the links.
     *
     * This works fine if two items are such that their link + description fit
     * in one line. However, in case the description goes over into a second
     * line, then this visually causes such items to have "too much" of a gap
     * below them. I haven't yet thought of a non-hacky way to selectively
     * introduce this extra margin only for the former case (where the link +
     * description fit in one line, which causes that line itself to have the 2
     * px bottom-border for the link).
     */
    margin-bottom: 2px;
`;

const Description = styled.span`
    color: var(--mrmr-secondary-color);
`;

export const Footer: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Footer_>
            {children}
            <div>
                <Link to={"/"}>Home</Link>
            </div>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    margin-block-start: 6rem;
    margin-block-end: 3rem;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

/**
 * A GraphQL fragment that can be emdedded in page queries to get the data
 * needed by a {@link PageListingPage}.
 */
export const query = graphql`
    fragment PageListingPageData on Mdx {
        frontmatter {
            title
            description
            formattedDateMY: date(formatString: "MMM YYYY")
            attributes
        }
        fields {
            slug
        }
    }
`;

/**
 * A helper function to parse the node obtained from a GraphQL query that embeds
 * the PageListingPageData fragment above into a {@link PageListingPage}.
 */
export const parsePageListingPageData = (
    node: RecursivelyReplaceNullWithUndefined<Queries.PageListingPageDataFragment>,
): PageListingPage => {
    const { frontmatter, fields } = node;
    const slug = ensure(fields?.slug);

    const title = ensure(frontmatter?.title);
    const description = frontmatter?.description;
    const formattedDateMY = ensure(frontmatter?.formattedDateMY);
    const attributes = filterDefined(frontmatter?.attributes);

    return { slug, title, description, formattedDateMY, attributes };
};
