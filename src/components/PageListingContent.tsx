import { Column } from "components/Column";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { PageColorStyle } from "components/PageColorStyle";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { paperDarkTheme } from "themes/themes";
import { isBumped, isHindiContent } from "utils/attributes";

interface PageListingContentProps {
    /** The ordered list of pages to show */
    pages: PageListingPage[];
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
> = ({ pages, children }) => {
    return (
        <main>
            <PageColorStyle {...paperDarkTheme} />
            <Column>
                <Title>{children}</Title>
                <LinkStyleUnderlined>
                    <PageListing {...{ pages }} />
                    <Footer />
                </LinkStyleUnderlined>
            </Column>
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
 *
 * Within each grouping, move pages that have been "bumped" to the top of the
 * listing for that month.
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
        if (isBumped(page)) {
            result.splice(++bumpSlot, 0, page);
        } else {
            result.push(page);
        }
    });

    return result;
};

const PageListing_ = styled.ul`
    margin-block-start: 2rem;

    list-style: none;
    padding-inline-start: 0;

    line-height: 1.25;

    a {
        border-bottom-width: 2px;
        font-weight: 600;
    }
`;

const SectionHeader = styled.h4`
    font-style: italic;
    font-weight: 300;
    font-size: 0.7rem;
    line-height: 1.9;
    opacity: 0.33;
    margin-block-end: 0rem;
`;

const PageItem: React.FC<PageListingPage> = (page) => {
    if (isHindiContent(page)) return HindiPageItem(page);

    const { title, description, slug } = page;
    return (
        <li>
            <Link to={slug}>{title}</Link>
            {". "}
            <Description>{description}</Description>
        </li>
    );
};

const HindiPageItem: React.FC<PageListingPage> = (page) => {
    const { title, description, slug } = page;

    // Incerase the line height for Hindi titles  - the default of 1.2rem
    // (declared in PageListing_) makes the Devanagari alphabet squished.
    //
    // This probably shouldn't be done for all fonts, but needs to be done on
    // macOS at least.
    const lineHeight = "1.6rem";

    // Also override the font size 1.05rem in the `Description` element.
    const fontSize = "1rem";

    return (
        <li style={{ lineHeight }}>
            <Link to={slug}>{title}</Link>
            {"। "}
            <Description style={{ fontSize }}>{description}</Description>
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
