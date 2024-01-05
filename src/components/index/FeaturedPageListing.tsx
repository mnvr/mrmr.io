import { Link } from "gatsby";
import { GatsbyImage, getImage, type ImageDataLike } from "gatsby-plugin-image";
import { type ColorPalette } from "parsers/colors";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

/** The data for each page required by the {@link FeaturedPageListing} component */
export interface FeaturedPage {
    title: string;
    slug: string;
    colors?: ColorPalette;
    darkColors?: ColorPalette;
    previewImage?: ImageDataLike;
}

interface FeaturedPageListingProps {
    /** The ordered list of pages to show */
    pages: FeaturedPage[];
    /** A function that is called when the user hovers over a link to a page */
    setHoverPage: (page: FeaturedPage | undefined) => void;
}

/** A component that renders a listing of the given pages */
export const FeaturedPageListing: React.FC<FeaturedPageListingProps> = ({
    pages,
    setHoverPage,
}) => {
    const n = pages.length;
    return (
        <PageGrid>
            {pages.map((page, i) => (
                <Link
                    key={page.slug}
                    to={page.slug}
                    onMouseEnter={() => setHoverPage(page)}
                    onMouseLeave={() => setHoverPage(undefined)}
                >
                    <PageItem
                        $backgroundColor={page.colors?.backgroundColor1}
                        $color={page.colors?.color1}
                    >
                        <BackgroundImage page={page} />
                        <PageItemContent>
                            <PageItemP>{page.title.toLowerCase()}</PageItemP>
                            <PageItemCount>{n - i}</PageItemCount>
                        </PageItemContent>
                    </PageItem>
                </Link>
            ))}
        </PageGrid>
    );
};

/** A CSS transition that makes the background color changes more pleasing */
export const BodyBackgroundColorTransitionStyle = createGlobalStyle`
    body {
        transition: background-color 200ms ease-out;
    }
`;

const PageGrid = styled.div`
    padding-inline: 2px;

    display: flex;
    flex-wrap: wrap;
    /* Instead of this gap (that mirrors the padding-inline above), we rely on
       the transparent / hover border below */
    /* gap: 2px; */

    font-weight: 500;
    font-variant: small-caps;

    a {
        text-decoration: none;
        /* Keep a transparent border of the same thickness as the border that
           would be used in the hover state. This avoids a layout shift on
           hover. */
        border: 1px solid transparent;
    }

    a:hover {
        border: 1px solid var(--mrmr-color-1-transparent);
    }
`;

interface PageItemProps {
    $backgroundColor?: string;
    $color?: string;
}

const PageItem = styled.div<PageItemProps>`
    background-color: ${(props) => props.$backgroundColor ?? "inherit"};
    color: ${(props) => props.$color ?? "inherit"};
    width: 13.7ch;
    height: 9.7ch;

    display: grid;
`;

const BackgroundImage: React.FC<{ page: FeaturedPage }> = ({ page }) => {
    const previewImage = page.previewImage;
    const image = previewImage ? getImage(previewImage) : undefined;

    // Use an empty alt since this is a decorative background image
    return (
        <BackgroundImageContainer>
            {image && <GatsbyImage image={image} alt="" />}
        </BackgroundImageContainer>
    );
};

const BackgroundImageContainer = styled.div`
    grid-area: 1 / 1;

    /* Same size as parent */
    width: 13.7ch;
    height: 9.7ch;

    /* Chrome 119 on macOS (and possibly others) still require the -webkit
       vendor prefix for both mask-image and linear-gradient */
    -webkit-mask-image: -webkit-linear-gradient(
        transparent,
        rgba(0, 0, 0, 0.3)
    );
    mask-image: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
`;

const PageItemContent = styled.div`
    padding-block: 0.33rem;
    padding-inline: 0.66rem;

    grid-area: 1 / 1;
    z-index: 1;

    position: relative;
`;

const PageItemP = styled.p`
    margin: 0.25rem 0;
    /* Set the width to the width of the smallest word. This causes each word to
       be on its own line */
    width: min-content;
`;

const PageItemCount = styled.div`
    position: absolute;
    bottom: 0.59rem;
    right: 0.66rem;
    font-size: 80%;
    font-style: italic;
    opacity: 0.8;
`;
