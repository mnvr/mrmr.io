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

    const [quote, setQuote] = React.useState("");

    React.useEffect(() => {
        if (!quote) setQuote(ensure(randomItem(parsedQuotes.quotes)));
    }, []);

    // Follow the hyperlink from the given word (in the current quote) to some
    // other (randomly selected) quote. Update the display by using setQuote to
    // update the current quote.
    const traverse = (word: string) => {
        const { quotesForWord } = parsedQuotes;
        const otherQuotes = ensure(quotesForWord.get(word)).filter(
            (q) => q !== quote,
        );
        setQuote(ensure(randomItem(otherQuotes)));
    };

    return quote ? (
        <Quote {...{ quote, parsedQuotes, traverse }} />
    ) : (
        <Loading />
    );
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
            .map((w) => w.toLowerCase())
            .forEach((word) => {
                quotesForWord.set(
                    word,
                    (quotesForWord.get(word) ?? []).concat([quote]),
                );
            });
    });

    // Remove words that only link to one quote (which will just be itself).
    for (const word of quotesForWord.keys()) {
        if (ensure(quotesForWord.get(word)).length === 1) {
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
    /** The quote text to show */
    quote: string;
    /** The parsed quote database */
    parsedQuotes: ParsedQuotes;
    /**
     * A function to call when the user clicks on the given word (that we know
     * also exists in other quotes).
     */
    traverse: (word: string) => void;
}

const Quote: React.FC<QuoteProps> = ({ quote, parsedQuotes, traverse }) => {
    const { quotesForWord } = parsedQuotes;

    const makeHandleClick = (word: string) => {
        return (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            traverse(word);
        };
    };

    const spans = words(quote).map((word) => {
        const key = word.toLowerCase();
        if (quotesForWord.has(key)) {
            return (
                <a href="#" onClick={makeHandleClick(key)}>
                    {word}
                </a>
            );
        } else {
            return <span>{word}</span>;
        }
    });

    // Intersperse the words with spaces (this'll result in an extra space at
    // the end, but that should be fine).
    const sentence = spans.reduce(
        (xs, span) => {
            return xs.concat([span, <span> </span>]);
        },
        [<span />],
    );

    return (
        <Quote_>
            {sentence.map((e, i) => (
                <React.Fragment key={i}>{e}</React.Fragment>
            ))}
        </Quote_>
    );
};

const Quote_ = styled.div`
    line-height: 1.6rem;

    a {
        background-color: lightyellow;
        text-decoration: none;
    }

    a:hover {
        background-color: greenyellow;
    }
`;

const Loading: React.FC = () => {
    return (
        <div>
            <Blinking>_</Blinking>
        </div>
    );
};

const Blinking = styled.span`
    animation: blink 700ms linear infinite alternate;

    @keyframes blink {
        0% {
            opacity: 0;
        }

        20% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
`;
