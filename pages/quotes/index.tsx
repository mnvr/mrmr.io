import * as React from "react";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { randomItem } from "utils/random";
import { quotes } from "./quotes";

export const Content: React.FC = () => {
    return (
        <Main>
            <Quotes />
        </Main>
    );
};

const Main = styled.main`
    margin: 1rem;
`;

const Quotes: React.FC = () => {
    const parsedQuotes = parseQuotes(quotes);
    const randomQuote = ensure(randomItem(parsedQuotes.quotes));

    return <Quote quote={randomQuote} parsedQuotes={parsedQuotes} />;
};

interface ParsedQuotes {
    quotes: string[];
    quotesForWord: Map<string, string[]>;
}

/**
 * Parse the array of quotes into the {@link ParsedQuotes} data structure which
 * is amenable to hyperlinking of the form that we want to do here.
 */
const parseQuotes = (quotes: string[]): ParsedQuotes => {
    const quotesForWord = new Map<string, string[]>();

    quotes.forEach((quote) => {
        words(quote)
            .filter((w) => !ignoredWords.has(w))
            .forEach((word) => {
                quotesForWord.set(
                    word,
                    (quotesForWord.get(word) ?? []).concat([word]),
                );
            });
    });

    // Remove words that only link to one quote (which will just be itself).
    for (const word of quotesForWord.keys()) {
        if (quotesForWord.get(word)?.length ?? 1 === 1) {
            quotesForWord.delete(word);
        }
    }

    return {
        quotes,
        quotesForWord,
    };
};

/** Break a string down into its component words */
const words = (s: string) => s.split(/\s+/).filter((s) => s);

/**
 * A set of common / filler words like "is", "the" etc that we ignore when
 * considering what words to hyperlink.
 */
const ignoredWords = new Set<string>(["the", "is", "a"]);

interface QuoteProps {
    quote: string;
    parsedQuotes: ParsedQuotes;
}

const Quote: React.FC<QuoteProps> = ({ quote, parsedQuotes }) => {
    const { quotesForWord } = parsedQuotes;
    const spans = words(quote).map((word) => {
        if (quotesForWord.has(word)) {
            return <a href="#">{word}</a>;
        } else {
            return <span>{word}</span>;
        }
    });
    // Intersperse the words with spaces
    const sentence = spans.reduce(
        (xs, span) => {
            return xs.concat([span, <span> </span>]);
        },
        [<span />],
    );

    return (
        <div>
            {sentence.map((e, i) => (
                <React.Fragment key={i}>{e}</React.Fragment>
            ))}
        </div>
    );
};
