import { DefaultHead } from "components/Head";
import { PageColorStyle } from "components/PageColorStyle";
import { graphql, HeadFC, navigate, PageProps } from "gatsby";
import { parseColorPalette } from "parsers/colors";
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
 *
 * This process could be inlined in the index page too (since that is where the
 * /random link exists), but that'd slow down the initial load of the index
 * page. So we load this separately.
 */
const RandomPage: React.FC<PageProps<Queries.RandomPageQuery>> = ({ data }) => {
    const pages = parsePages(data);

    // Wrap the redirect in a useEffect so that it doesn't happen during SSR.
    React.useEffect(() => {
        navigate(randomItem(pages)?.slug ?? "/");
    }, []);

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
        </main>
    );
};

const colorPalettes = {
    colors: ensure(parseColorPalette(["hsl(0, 0%, 100%)", "hsl(0, 0%, 13%)"])),
    darkColors: parseColorPalette(["hsl(240, 6%, 20%)", "hsl(240, 12%, 90%)"]),
};

export default RandomPage;

export const Head: HeadFC = () => <DefaultHead titleSuffix="Random 🎲" />;

/**
 * Fetch all pages, sorted by recency.
 *
 * - Exclude the pages which are marked `unlisted` (e.g. the "_example" page).
 */
export const query = graphql`
    query RandomPage {
        allMdx(
            filter: { frontmatter: { unlisted: { ne: true } } }
            sort: [
                { frontmatter: { date: DESC } }
                { frontmatter: { title: ASC } }
            ]
        ) {
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
