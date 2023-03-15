import { ExternalLink } from "components/ExternalLink";
import { ParsedLink } from "parsers/links";
import * as React from "react";
import { FaGithub } from "react-icons/fa";
import styled from "styled-components";

/**
 * A row of icons buttons, each linking to one of the passed in links.
 *
 * Each of these links will open in an new tab. @see {@link ParsedLinkButton}.
 */
export const ParsedLinkButtons: React.FC<{ links: ParsedLink[] }> = ({
    links,
}) => {
    return (
        <ParsedLinkRow>
            {links.map((link) => (
                <ParsedLinkButton key={link.url} link={link} />
            ))}
        </ParsedLinkRow>
    );
};

const ParsedLinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
`;

/**
 * A button that shows a {@link ParsedLink}, special casing the icons for
 * {@link KnownDomains}.
 *
 * The link will open in a new tab.
 *
 * @see {@link ParsedLinkButtons}
 */
export const ParsedLinkButton: React.FC<{ link: ParsedLink }> = ({ link }) => {
    const { url, knownDomain } = link;
    return (
        <ExternalLink href={url}>
            <GithubIcon link={link} />
        </ExternalLink>
    );
};

const GithubIcon: React.FC<{ link: ParsedLink }> = ({ link }) => {
    const title = link.title ?? "GitHub";
    return <FaGithub size="1.5rem" title={title} />;
};
