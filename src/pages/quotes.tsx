import { DefaultHead } from "components/Head";
import { type HeadFC } from "gatsby";
import * as React from "react";
import { ensure } from "utils/ensure";

/**
 * A page with an interactive graph of quotes, linked together by words common
 * between them.
 */
const QuotesPage: React.FC = () => {
    const quotes = ["Chaos is a ladder"];
    const text = ensure(quotes[0]);

    return <Quote text={text} />;
};

export default QuotesPage;

export const Head: HeadFC = () => {
    const titlePrefix = "Quotes";
    const description =
        "An interactive graph of decontextualized quotations linked together by words common between them.";
    const canonicalPath = "/quotes";

    return <DefaultHead {...{ titlePrefix, description, canonicalPath }} />;
};

interface QuoteProps {
    text: string;
}

const Quote: React.FC<QuoteProps> = ({ text }) => {
    return <div>{text}</div>;
};
