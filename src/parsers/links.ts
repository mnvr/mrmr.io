import { getDomain, getDomainWithoutSuffix } from "tldts";
import { isDefined } from "utils/array";

/** Domains that we have special casing for (e.g. custom icons) */
export type KnownDomain =
    | "github"
    | "twitter"
    | "instagram"
    | "youtube"
    | "reddit";

/** A type guard for {@link KnownDomain}s */
export const isKnownDomain = (s: string): s is KnownDomain => {
    return (
        s == "github" ||
        s == "twitter" ||
        s == "instagram" ||
        s == "youtube" ||
        s == "reddit"
    );
};

/** Return an appropriate human readable title to describe the given domain */
const titleForKnownDomain = (d: KnownDomain) => {
    switch (d) {
        case "github":
            return "GitHub";
        case "twitter":
            return "Twitter";
        case "instagram":
            return "Instagram";
        case "youtube":
            return "YouTube";
        case "reddit":
            return "Reddit";
    }
};

/** A parsed link, with a {@link KnownDomain} (if any) attached */
export interface ParsedLink {
    /** The original string with with this link was constructed */
    url: string;
    /** A known domain which we were able to deduce for the {@link url} */
    knownDomain?: KnownDomain;
    /**
     * Title. It can be used for example to serve as the tooltip when hovering
     * on an icon linking to the url.
     */
    title?: string;
}

/** A sibling of parsed links for relative links within the site */
export interface ParsedSlug {
    /** The slug (absolute path, but within our site) of the destination */
    slug: string;
    /** Optional title, serves as a tooltip */
    title?: string;
}

/** General link parser */
export const parseLink = (s: string) => {
    const domain = getDomainWithoutSuffix(s);
    const knownDomain = domain && isKnownDomain(domain) ? domain : undefined;
    // Use one of the special cased titles if it is a known domain, otherwise
    // use the domain itself (including the suffix) as the title.
    const title = knownDomain
        ? titleForKnownDomain(knownDomain)
        : // This nested fallback to convert the null to an undefined
          getDomain(s) ?? undefined;
    return { url: s, knownDomain, title };
};

type InputURLs = readonly (string | undefined)[] | undefined;

/** General link parser for a list of URLs */
export const parseLinks = (ss: InputURLs) =>
    ss?.filter(isDefined)?.map(parseLink);
