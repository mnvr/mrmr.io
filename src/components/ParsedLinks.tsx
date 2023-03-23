import { ExternalLink } from "components/ExternalLink";
import { Link } from "gatsby";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import { FaInstagram } from "react-icons/fa";
import { FiGithub, FiLink, FiList, FiTwitter, FiYoutube } from "react-icons/fi";
import { RiRedditLine } from "react-icons/ri";
import styled from "styled-components";

export interface ParsedLinkButtonsProps {
    /** The links to show */
    links?: ParsedLink[];
    /** If present, then a link is show to a user page using the given props */
    userPageLink?: UserPageLinkButtonProps;
}

export interface UserPageLinkButtonProps {
    slug: string;
    title: string;
}

/**
 * A row of icons buttons, each linking to one of the passed in links.
 *
 * Each of these links will open in an new tab. @see {@link ParsedLinkButton}.
 */
export const ParsedLinkButtons: React.FC<ParsedLinkButtonsProps> = ({
    links,
    userPageLink,
}) => {
    return (
        <ParsedLinkRow>
            {links?.map((link) => (
                <ParsedLinkButton key={link.url} link={link} />
            ))}
            {userPageLink && <UserPageLinkButton {...userPageLink} />}
        </ParsedLinkRow>
    );
};

const ParsedLinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
`;

/**
 * A button that shows a {@link ParsedLink}, special casing the icons for
 * {@link KnownDomains}.
 *
 * The link will open in a new tab.
 *
 * @see {@link ParsedLinkButtons}
 */
export const ParsedLinkButton: React.FC<IconProps> = ({ link }) => {
    const { url } = link;
    return (
        <ExternalLink href={url}>
            <IconContainer>
                <KnownLinkIcon link={link} />
            </IconContainer>
        </ExternalLink>
    );
};

/**
 * A button that shows a link to the given user's home page.
 *
 * @see {@link ParsedLinkButtons} for links that are external to the site.
 */
export const UserPageLinkButton: React.FC<UserPageLinkButtonProps> = ({
    slug,
    title,
}) => {
    return (
        <Link to={slug}>
            <IconContainer>
                <FiList title={title} />
            </IconContainer>
        </Link>
    );
};

const IconContainer = styled.div`
    /** Ensure sufficient tap area for mobile devices */
    min-width: 44px;
    min-height: 44px;

    /** 
     * Center the SVG within the tap area if the SVG is smaller than the mininum
     * dimensions (this'll usually be the case).
     */
    display: flex;
    justify-content: center;
    align-items: center;

    /* Show the hand icon on hover */
    cursor: pointer;

    /* Set the size of the icon */
    font-size: 2rem;
`;

type IconProps = { link: ParsedLink };

const KnownLinkIcon: React.FC<IconProps> = ({ link }) => {
    const { knownDomain } = link;
    if (knownDomain == "github") return <GithubIcon link={link} />;
    if (knownDomain == "twitter") return <TwittterIcon link={link} />;
    if (knownDomain == "instagram") return <InstagramIcon link={link} />;
    if (knownDomain == "youtube") return <YouTubeIcon link={link} />;
    if (knownDomain == "reddit") return <RedditIcon link={link} />;
    // If it is not one of the known domains, return the generic link icon.
    return <GenericLinkIcon link={link} />;
};

const GithubIcon: React.FC<IconProps> = ({ link }) => {
    // Reduce the size a bit to make it fit better with the rest of the gang.
    //
    // Note the use of "em" to scale it relative to the computed font size of
    // these icons – if we'd used rem it'd have scaled it relative to the root
    // font size.
    return <FiGithub size="0.96em" title={link.title} />;
};

const TwittterIcon: React.FC<IconProps> = ({ link }) => {
    return <FiTwitter title={link.title} />;
};

const InstagramIcon: React.FC<IconProps> = ({ link }) => {
    return <FaInstagram title={link.title} />;
};

const YouTubeIcon: React.FC<IconProps> = ({ link }) => {
    return <FiYoutube title={link.title} />;
};

const RedditIcon: React.FC<IconProps> = ({ link }) => {
    return <RiRedditLine title={link.title} />;
};

const GenericLinkIcon: React.FC<IconProps> = ({ link }) => {
    return <FiLink size="0.95em" title={link.title} />;
};
