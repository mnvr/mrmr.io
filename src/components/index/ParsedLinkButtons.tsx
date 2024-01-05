import { ExternalLink } from "components/ExternalLink";
import { type ParsedLink } from "parsers/links";
import * as React from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiGithub, FiLink } from "react-icons/fi";
import { RiRedditLine } from "react-icons/ri";
import styled from "styled-components";

export interface ParsedLinkButtonsProps {
    /** The links to show */
    links?: ParsedLink[];
}

/**
 * A row of icons buttons, each linking to one of the passed in links.
 *
 * Each of these links will open in an new tab. @see {@link ParsedLinkButton}.
 */
export const ParsedLinkButtons: React.FC<ParsedLinkButtonsProps> = ({
    links,
}) => {
    return (
        <ParsedLinkRow>
            {links?.map((link) => (
                <ParsedLinkButton key={link.url} link={link} />
            ))}
        </ParsedLinkRow>
    );
};

const ParsedLinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1.3rem;
`;

/**
 * A button that shows a {@link ParsedLink}, special casing the icons for
 * {@link KnownDomains}.
 *
 * The link will open in a new tab.
 *
 * @see {@link ParsedLinkButtons}
 */
const ParsedLinkButton: React.FC<IconProps> = ({ link }) => {
    const { url } = link;
    return (
        <ExternalLink href={url}>
            <IconContainer>
                <KnownLinkIcon link={link} />
            </IconContainer>
        </ExternalLink>
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
    font-size: 1.9rem;
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
    return <FiGithub title={link.title} />;
};

const TwittterIcon: React.FC<IconProps> = ({ link }) => {
    return <FaTwitter title={link.title} />;
};

const InstagramIcon: React.FC<IconProps> = ({ link }) => {
    return <FaInstagram title={link.title} />;
};

const YouTubeIcon: React.FC<IconProps> = ({ link }) => {
    return <FaYoutube title={link.title} />;
};

const RedditIcon: React.FC<IconProps> = ({ link }) => {
    return <RiRedditLine title={link.title} />;
};

const GenericLinkIcon: React.FC<IconProps> = ({ link }) => {
    return <FiLink size="0.95em" title={link.title} />;
};
