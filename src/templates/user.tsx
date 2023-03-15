import { Column } from "components/Column";
import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import { ensure } from "utils/ensure";
import { PageColors, parsePageColors } from "utils/page-colors";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserPage: React.FC<PageProps<Queries.UserIndexQuery>> = ({
    data,
    children,
}) => {
    const defaultColors = {
        backgroundColor: "hsl(0, 0%, 100%)",
        color1: "hsl(0, 0%, 15%)",
        color2: "hsl(0, 0%, 15%)",
        color3: "hsl(0, 0%, 13%)",
        darkBackgroundColor: "hsl(198, 13%, 8%)",
        darkColor1: "hsl(0, 0%, 87%)",
        darkColor2: "hsl(0, 0%, 87%)",
        darkColor3: "hsl(0, 0%, 87%)",
    };

    const user = parseUser(data);

    return (
        <main>
            <PageColorStyle {...defaultColors} />
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
    pages: Page[];
}

interface Page {
    title: string;
    slug: string;
    colors: PageColors;
}

const parseUser = (data: Queries.UserIndexQuery) => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    let parsedUser: User | undefined;
    const pages: Page[] = [];
    nodes.forEach((node) => {
        const { frontmatter, fields } = node;
        const template = ensure(fields?.template);

        if (template == "user") {
            const name = ensure(frontmatter?.name);

            parsedUser = { name, pages: [] };
        } else {
            const title = ensure(frontmatter?.title);
            const slug = ensure(fields?.slug);
            const colors = parsePageColors(frontmatter?.colors);

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
