import { DefaultHead } from "components/Head";
import { graphql, navigate, type HeadFC, type PageProps } from "gatsby";
import * as React from "react";
import { ensure } from "utils/ensure";
import { randomItem } from "utils/random";
import { replaceNullsWithUndefineds } from "utils/replace-nulls";

/**
 * Redirect to a random page.
 *
 * Since the site is statically generated, what we do is:
 * - Generate a list of all eligible pages at build time.
 * - When the page is loaded, randomly select one of these (on the client side)
 *   and do a client side redirect to it.
 */
const RandomPage: React.FC<PageProps<Queries.RandomPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    // Wrap the redirect in a useEffect so that it doesn't happen during SSR.
    React.useEffect(() => {
        navigate(randomItem(pages)?.slug ?? "/");
    }, []);

    return <main />;
};

export default RandomPage;

export const Head: HeadFC = () => <DefaultHead titlePrefix="Random 🎲" />;

/** Fetch slugs for pages in the "/all" feed. */
export const query = graphql`
    query RandomPage {
        allMdx(filter: { fields: { feed: { eq: "/all" } } }) {
            nodes {
                fields {
                    slug
                }
            }
        }
    }
`;

interface Page {
    slug: string;
}

const parsePages = (data: Queries.RandomPageQuery): Page[] => {
    const allMdx = replaceNullsWithUndefineds(data.allMdx);
    const nodes = allMdx.nodes;

    return nodes.map((node) => {
        const { fields } = node;
        const slug = ensure(fields?.slug);

        return { slug };
    });
};
