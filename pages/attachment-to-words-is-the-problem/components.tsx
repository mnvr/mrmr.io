import { WideColumn } from "components/Column";
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
    margin-block: 4rem;

    line-height: 1.3rem;

    hr {
        margin-block: 2.8rem;

        opacity: 0.075;
        @media (prefers-color-scheme: dark) {
            opacity: 0.15;
        }
    }

    blockquote {
        font-family: serif;
        font-style: italic;
        margin-block: 1.3rem;
        color: var(--mrmr-color-3);
    }
`;

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title, formattedDateMY } = page;

    return (
        <TitleContainer>
            <small>
                <TitleH>{title}</TitleH>
                <Attribution>
                    Manav Rathi
                    <br />
                    {/* {formattedDateMY} */}
                    Nov, 2023
                    {/* <LinkContainer>
                    <Link to={"/"}>Home</Link>
                </LinkContainer> */}
                </Attribution>
            </small>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block: 3.25rem;

    line-height: 1.1rem;
`;

const TitleH = styled.h3`
    margin-block-end: 0rem;

    color: var(--mrmr-color-1);
`;

const Attribution = styled.p`
    margin-block-start: 0.65rem;

    color: var(--mrmr-color-3);
`;

const LinkContainer = styled.div`
    /*

    color: var(--mrmr-color-3);

    /* a {
        text-decoration: none;
        font-weight: 500;
    }

    a:hover {
         color: var(--mrmr-color-2);
    }
    */
    margin-block: 3rem;
`;
