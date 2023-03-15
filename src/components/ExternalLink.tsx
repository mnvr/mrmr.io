import * as React from "react";

/** A link that opens in an new tab */
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
