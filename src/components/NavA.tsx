import { Link } from "gatsby";
import { useShare } from "hooks/use-share";
import React from "react";
import { type Page } from "templates/page";
import { fullURLForSlug } from "utils/url";

interface NavProps {
    /** The page for which to construct the links */
    page: Page;
    /**
     * The separator between the links
     *
     * Optional. If unspecified, the default "/" is used.
     */
    separator?: string;
}

/** Display a set of Share / More links for the given page */
export const NavA: React.FC<NavProps> = ({ page, separator }) => {
    const { title, description, slug } = page;
    const sep = ` ${separator ?? "/"} `;

    const [canShare, handleShareClick] = useShare({
        url: fullURLForSlug(slug),
        title,
        text: description,
    });

    return (
        <small>
            {canShare && (
                <>
                    <a href="#" onClick={handleShareClick}>
                        Share
                    </a>
                    <span>{sep}</span>
                </>
            )}
            <Link to="/">More</Link>
        </small>
    );
};
