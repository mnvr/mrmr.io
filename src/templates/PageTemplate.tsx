import {
    PageColorStyle,
    paletteSetOrFallback,
} from "components/PageColorStyle";
import { type PageProps } from "gatsby";
import * as React from "react";
import { allThemes, defaultTheme } from "themes/themes";
import type { PageTemplateContext } from "types/gatsby";
import { Layout, parsePage } from "./page";

export const PageTemplate: React.FC<
    PageProps<Queries.PageTemplateQuery, PageTemplateContext>
> = ({ data, children }) => {
    const page = parsePage(data);
    const colorPalettes = paletteSetOrFallback(
        page,
        page.theme ? allThemes[page.theme] : undefined,
        defaultTheme,
    );

    return (
        <main>
            <PageColorStyle {...colorPalettes} />
            <Layout page={page}>{children}</Layout>
        </main>
    );
};
