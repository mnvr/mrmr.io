import * as React from "react";
import { RxArrowTopRight } from "react-icons/rx";

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
