import { Column } from "components/Column";
import * as React from "react";
import styled from "styled-components";

export const Page: React.FC = () => {
    return (
        <ContentContainer>
            <Column>
                <Poem />
                <Title />
                <Footer />
            </Column>
        </ContentContainer>
    );
};

const ContentContainer = styled.div`
    margin-block: 3rem;
    margin-inline: 0.5rem;
`;

const Poem: React.FC = () => {
    return (
        <PoemContainer>
            <p>
                I never paid the children
                <br />
                whose smiles made me smile
                <br />
                The trees whose leaves gave me shade
                <br />
                And breath
                <br />
                And the mountains that took it away
            </p>
            <p>Yet I need money</p>
        </PoemContainer>
    );
};

const PoemContainer = styled.div`
    line-height: 1.35rem;
`;

const Title: React.FC = () => {
    return (
        <TitleContainer>
            <p>
                <b>Money</b>
                <br />
                <small>Manav Rathi, Mar 2023</small>
            </p>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    margin-block-start: 4.4rem;
    line-height: 1.3rem;
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <p>
                <small>Share | Remix | More</small>
            </p>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block-start: 3.25rem;
`;
