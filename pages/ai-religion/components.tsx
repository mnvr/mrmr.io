import { WideColumn } from "components/Column";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <WideColumn>
            <ContentContainer>{children}</ContentContainer>
        </WideColumn>
    );
};

const ContentContainer = styled.div`
    margin-block: 2.8rem;

    h3 {
        margin-block: 1.9rem;
    }

    hr {
        margin-block: 2.8rem;

        opacity: 0.075;
        @media (prefers-color-scheme: dark) {
            opacity: 0.15;
        }
    }

    blockquote {
        color: var(--mrmr-color-2);
        font-family: serif;
        font-style: italic;
        margin-block-start: 1.5rem;
        margin-block-end: 2rem;
    }
`;

export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <FooterContainer>
            <small>
                Manav Rathi
                <br />
                {formattedDateMY}
                <LinkContainer>
                    <Link to={"/"}>home</Link>
                </LinkContainer>
            </small>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block: 2rem;

    @media (min-width: 600px) {
        margin-block: 3rem;
     }

    color: var(--mrmr-color-2);

    a {
        text-decoration: none;
        opacity: 0.8;
        font-weight: 500;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
    }
`;

const LinkContainer = styled.div`
    margin-block: 3rem;
`;
