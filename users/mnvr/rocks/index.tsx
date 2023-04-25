import { NavA } from "components/NavA";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext, type Page } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <>
            <Title />
            <RockImages page={page} />
            <Footer />
            <PageFooterA />
        </>
    );
};

const Title: React.FC = () => {
    return (
        <TitleContainer>
            <TitleH2>Rocks</TitleH2>
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
    position: absolute;
    z-index: 1;
    width: 100%;
    font-variant: small-caps;
    /* Tuned for the first rock image, "painting.jpg" */
    background-color: rgba(82, 80, 85, 0.4);
`;

const TitleH2 = styled.h2`
    margin: 0.5rem;
    padding-inline: 0.5rem;
`;

interface PageImageProps {
    page: Page;
    name: string;
    alt: string;
}

const PageImage: React.FC<PageImageProps> = ({ page, name, alt }) => {
    const image = ensure(getImage(ensure(page.images[name])));

    return <GatsbyImage image={image} alt={alt} />;
};

const RockImages: React.FC<{ page: Page }> = ({ page }) => {
    return (
        <>
            {rockImages.map(({ name, alt }) => {
                return (
                    <RockImageContainer key={name}>
                        <PageImage page={page} name={name} alt={alt} />
                    </RockImageContainer>
                );
            })}
        </>
    );
};

const RockImageContainer = styled.div`
    border-bottom: 1px solid transparent;
`;

const rockImages = [
    {
        name: "painting",
        alt: "A rock face that looks like a painting with thick, yet intricate, brush strokes",
    },
    {
        name: "granite",
        alt: "A comforting, carbon like rock face",
    },
    {
        name: "gold",
        alt: "Rust and gold colored rock face",
    },
    {
        name: "red",
        alt: "A red colored rock face, drifting into cream",
    },
    {
        name: "people",
        alt: "Rock face with shades of brown, appearing like silhouettes of people",
    },
    {
        name: "silver",
        alt: "A silver, shiny, rock face",
    },
    {
        name: "disintegrating",
        alt: "A rock that is disintegrating into its constituent shards",
    },
];

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <p>
                Rocks found on and around the shores of the river in Sissu
                Valley, in India.
            </p>
            <LatLngP>
                <small>
                    32° 27' 25.308" N<br />
                    77° 7' 46.12" E
                </small>
            </LatLngP>
        </FooterContainer>
    );
};

const FooterContainer = styled.div`
    margin-block-start: 2rem;
    margin-block-end: 2rem;
    margin-inline: 1rem;
`;

const LatLngP = styled.p`
    color: var(--mrmr-color-1-transparent);
`;

const FooterContainer2 = styled.div`
    margin-inline: 1rem;
`;

const PageFooterA: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));

    return (
        <FooterContainer2>
            <PageInfo page={page} />
            <NavContainer>
                <NavA page={page} separator="•" />
            </NavContainer>
        </FooterContainer2>
    );
};

interface PageInfoProps {
    page: Page;
}

const PageInfo: React.FC<PageInfoProps> = ({ page }) => {
    const { formattedDateDMY, user } = page;
    const { name } = user;

    return (
        <PageInfoContents>
            <DetailsContainer>
                {name}, {formattedDateDMY}
            </DetailsContainer>
        </PageInfoContents>
    );
};

const PageInfoContents = styled.div`
    margin-block-end: 0rem;
`;

const DetailsContainer = styled.div`
    margin-block-end: 0rem;
    color: var(--mrmr-color-4);
`;

const NavContainer = styled.div`
    margin-block: 0.3rem;
    margin-block-end: 3rem;

    a {
        text-decoration: none;
        color: var(--mrmr-color-4);
    }

    a:hover {
        border-bottom: 1px solid currentColor;
        color: var(--mrmr-color-1);
    }
`;
