import { Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

/**
 * A simple footer that takes a full screen, and shows the page title (+ a link
 * to the home page) in the center.
 */
export const FooterA: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title } = page;

    return (
        <FooterContainer>
            <FooterContents>
                <div>
                    <big>
                        <b>{title}</b>
                    </big>
                </div>
                <div>
                    <small>
                        <span className="link-prelude">by </span>
                        <Link to="/">Manav</Link>
                    </small>
                </div>
            </FooterContents>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    display: grid;
    place-items: center;
    min-height: 100svh;
`;

const FooterContents = styled.div`
    text-align: center;

    .link-prelude {
        opacity: 0.7;
    }

    a {
        text-decoration: none;
        opacity: 0.7;
        border-bottom: 1px solid currentColor;
    }

    a:hover {
        opacity: 1;
    }
`;
