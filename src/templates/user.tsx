import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import {
    createPageColorStyleProps,
    PageColorStyle,
} from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import { ensure } from "utils/ensure";
import { PageColors, parsePageColors } from "utils/page-colors";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserPage: React.FC<PageProps<Queries.UserIndexQuery>> = ({
    data,
    children,
}) => {
    const user = parseUser(data);

    return (
        <main>
            <PageColorStyle {...createPageColorStyleProps(user.colors)} />
            <Column>
                <Header {...user} />
                {children}
            </Column>
        </main>
    );
};

export default UserPage;

export const Head: HeadFC<Queries.UserIndexQuery> = ({ data }) => {
    const { name } = parseUser(data);

    return <DefaultHead title={name} />;
};

export const query = graphql`
    query UserIndex($username: String!) {
        allMdx(
            filter: { fields: { username: { eq: $username } } }
            sort: { frontmatter: { date: DESC } }
        ) {
            nodes {
                frontmatter {
                    name
                    title
                    colors
                }
                fields {
                    slug
                    template
                }
            }
        }
    }
`;

interface User {
    name: string;
    colors?: PageColors;
    pages: Page[];
}

interface Page {
    title: string;
    slug: string;
    colors?: PageColors;
}

const parseUser = (data: Queries.UserIndexQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    let parsedUser: User | undefined;
    const pages: Page[] = [];
    nodes.forEach((node) => {
        const { frontmatter, fields } = node;
        const template = ensure(fields?.template);
        const colors = parsePageColors(frontmatter?.colors);

        if (template == "user") {
            const name = ensure(frontmatter?.name);

            parsedUser = { name, colors, pages: [] };
        } else {
            const title = ensure(frontmatter?.title);
            const slug = ensure(fields?.slug);

            const page = { title, slug, colors };

            pages.push(page);
        }
    });

    const user = ensure(parsedUser);
    return { ...user, pages };
};

const Header: React.FC<User> = ({ name }) => {
    return (
        <>
            <h1>{name}</h1>
        </>
    );
};
