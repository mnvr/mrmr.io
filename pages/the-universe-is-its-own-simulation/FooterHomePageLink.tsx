import { FooterHomePageLogo } from "components/FooterHomePageLogo";
import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";

export const FooterHomePageLink: React.FC = ({}) => {
    return (
        <LinkContainer>
            <Link to={"/"} title={"More by me"}>
                <LinkContents>
                    <CaptionContainer>more</CaptionContainer>
                    <FooterHomePageLogo />
                </LinkContents>
            </Link>
        </LinkContainer>
    );
};

const LinkContainer = styled.div`
    display: flex;
    justify-content: center;

    a {
        text-decoration: none;
        opacity: 0.5;
    }

    a:hover {
        opacity: 0.77;
    }
`;

const LinkContents = styled.div`
    display: flex;

    flex-direction: column;
    align-items: center;
    gap: 2rem;

    img {
        border-radius: 5px;
    }
`;

const CaptionContainer = styled.div`
    font-size: 0.7rem;
    font-weight: 600;

    text-align: center;

    color: oklch(48% 0 0);
`;
