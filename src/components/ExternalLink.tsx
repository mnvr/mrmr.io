import React from "react";
import { ImArrowUpRight2 } from "react-icons/im";
import { RxArrowTopRight } from "react-icons/rx";
import styled from "styled-components";

/**
 * A link that opens in an new tab
 *
 * @see also {@link ExternalLinkWithIcon}.
 * */
export const ExternalLink: React.FC<
    React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ children, ...props }) => {
    // Newer browsers implicitly add rel="noopener" for target="_blank", but
    // support is still not 100% though and it's easy to add explicitly, so
    // might as well.
    return (
        <a target="_blank" rel="noopener" {...props}>
            {children}
        </a>
    );
};

/**
 * A link that opens in an new tab, with an indicator.
 *
 * This is a variant of {@link ExternalLink} that shows an outward (top right)
 * facing arrow icon after the children to indicate that the link will open in a
 * new tab.
 *
 * There is also a shorter alias, {@link ELink}.
 * */
export const ExternalLinkWithIcon: React.FC<
    React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ children, ...props }) => {
    return (
        <a target="_blank" rel="noopener" {...props}>
            {children}
            <RxArrowTopRight />
        </a>
    );
};

/** An alias for {@link ExternalLinkWithIcon} */
export const ELink = ExternalLinkWithIcon;

/** A reference link to some external content that opens in an new tab */
export const RefLink: React.FC<
    React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ ...props }) => {
    return (
        <small>
            <RefLinkSuperscript_>
                <ExternalLink {...props}>
                    <ImArrowUpRight2 />
                </ExternalLink>
            </RefLinkSuperscript_>
        </small>
    );
};

const RefLinkSuperscript_ = styled.sup`
    a {
        font-size: 75%;
        /* Otherwise it causes the lines with these links to be taller than
           normal lines */
        line-height: 100%;
    }
`;
