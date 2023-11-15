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
    margin-block: 2rem;
    @media (min-width: 600px) {
        margin-block: 4rem;
    }

    line-height: 1.3rem;

    hr {
        margin-block: 2.8rem;
        opacity: 0.075;
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
        <Title_>
            <small>
                <TitleH>{title}</TitleH>
                <Attribution>
                    Manav Rathi
                    <br />
                    {formattedDateMY}
                </Attribution>
            </small>
        </Title_>
    );
};

const Title_ = styled.div`
    margin-block-start: 3.25rem;
`;

const TitleH = styled.h3`
    margin-block-end: 0rem;

    color: var(--mrmr-color-2);
`;

const Attribution = styled.p`
    margin-block-start: 0.65rem;
    line-height: 1.1rem;

    color: var(--mrmr-color-3);
`;

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <Link to={"/all"}>All posts</Link>
            <br />
            <Link to={"/"}>Home</Link>
        </Footer_>
    );
};

const Footer_ = styled.div`
    margin-block-start: 6rem;
    font-size: 0.8rem;
    line-height: 2.3rem;
    @media (min-width: 600px) {
        line-height: 1.6rem;
    }

    a {
        text-decoration: none;
        font-weight: 500;
        color: var(--mrmr-color-1);
    }

    a:hover {
        color: var(--mrmr-color-2);
    }
`;
