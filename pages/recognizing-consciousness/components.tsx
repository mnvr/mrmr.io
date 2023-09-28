import { NavA } from "components/NavA";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Title: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedDateMY } = page;

    return (
        <TitleContainer>
            <Caption>
                Manav Rathi
                <br />
                {formattedDateMY}
            </Caption>
        </TitleContainer>
    );
};

const TitleContainer = styled.p`
    margin-block: 2rem;
`;

const Caption = styled.small`
    color: var(--mrmr-color-2);
`;

export const Footer: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <NavContainer>
            <NavA page={page} separator="·" />
        </NavContainer>
    );
};

const NavContainer = styled.div`
    margin-block: 3rem;

    color: var(--mrmr-color-2);

    a {
        text-decoration: none;
        opacity: 0.8;
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        opacity: 1;
    }
`;
