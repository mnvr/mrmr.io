import { DefaultHead } from "components/Head";
import { graphql, HeadFC, PageProps } from "gatsby";
import * as React from "react";
import { UserTemplateContext } from "types/gatsby";
import { ensure } from "utils/ensure";
import { PageColors, parsePageColors } from "utils/page-colors";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

const UserPage: React.FC<
    PageProps<Queries.UserIndexQuery, UserTemplateContext>
> = ({ data, children }) => {
    const user = parseUser(data);

    return (
        <main>
            {/* <PageColorStyle {...createPageColorStyleProps(colors)} /> */}
            {children}
        </main>
    );
};

export default UserPage;

export const Head: HeadFC<Queries.UserIndexQuery, UserTemplateContext> = ({
    data,
    pageContext,
}) => {
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
