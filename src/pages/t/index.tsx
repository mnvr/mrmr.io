import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import { LinkStyleUnderlined } from "components/LinkStyles";
import { PageColorStyle } from "components/PageColorStyle";
import { Link, graphql, type HeadFC, type PageProps } from "gatsby";
import { parseTagData, type Tag } from "parsers/tag";
import * as React from "react";
import styled from "styled-components";
import { paperDarkTheme } from "themes/themes";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";
import { capitalize } from "utils/string";

/*** A listing of all the tags */
const TagsPage: React.FC<PageProps<Queries.TagsPageQuery>> = ({ data }) => {
    const tags = parseTags(data);

    return (
        <main>
            <PageColorStyle {...paperDarkTheme} />
            <Content {...{ tags }} />
        </main>
    );
};

export default TagsPage;

export const Head: HeadFC = () => {
    const titlePrefix = "All tags";
    const description = `Listing of tags on mrmr.io`;
    const canonicalPath = "/t";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

/** Fetch all tags */
export const query = graphql`
    query TagsPage {
        allTagsYaml {
            nodes {
                ...TagData
            }
        }
    }
`;

const parseTags = (data: Queries.TagsPageQuery): Tag[] =>
    replaceNullsWithUndefineds(data.allTagsYaml).nodes.map(parseTagData);

interface TagsProps {
    tags: Tag[];
}

const Content: React.FC<TagsProps> = (props) => {
    return (
        <Column>
            <LinkStyleUnderlined>
                <Title_>tags</Title_>
                <TagList {...props} />
                <Footer />
            </LinkStyleUnderlined>
        </Column>
    );
};

const Title_ = styled.h1`
    margin-block-start: 2rem;
    @media (min-width: 600px) {
        margin-block-start: 3rem;
    }

    font-family: serif;
    font-style: italic;
    color: var(--mrmr-color-4);
`;

const TagList: React.FC<TagsProps> = ({ tags }) => {
    return (
        <TagUL>
            {tags.map((tag) => (
                <TagLI key={tag.tag} color={tag.color}>
                    <TagItem tag={tag} />
                </TagLI>
            ))}
        </TagUL>
    );
};

const TagUL = styled.ul`
    margin-block-start: 2.2rem;
`;

const TagLI = styled.li<{ color?: string }>`
    color: ${(props) => props.color ?? "inherit"};
    margin-block: 1rem;
    a {
        color: var(--mrmr-color-1);
    }
`;

const TagItem: React.FC<{ tag: Tag }> = ({ tag }) => {
    const { slug } = tag;
    const label = capitalize(tag.tag);
    return <Link to={slug}>{label}</Link>;
};

export const Footer: React.FC = () => {
    return (
        <Footer_>
            <div>
                <Link to={"/poems"}>Poems</Link>
            </div>
            <div>
                <Link to={"/"}>Home</Link>
            </div>
        </Footer_>
    );
};

const Footer_ = styled.footer`
    margin-block-start: 4rem;
    margin-block-end: 3rem;
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
