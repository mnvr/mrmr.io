import { ExternalLink } from "components/ExternalLink";
import * as React from "react";
import { ImArrowUpRight2 } from "react-icons/im";
import styled from "styled-components";

/** A reference link to some external content that opens in an new tab */
export const RefLink: React.FC<
    React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
> = ({ ...props }) => {
    return (
        <RefLinkSuperscript_>
            <ExternalLink {...props}>
                <ImArrowUpRight2 />
            </ExternalLink>
        </RefLinkSuperscript_>
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
