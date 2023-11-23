import * as React from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "styled-components";
import { ensure } from "utils/ensure";
import { randomInt, randomItem } from "utils/random";
import { ParsedQuotes, parseQuotes } from "./parse";
import { quotes } from "./quotes";

export const Content: React.FC = () => {
    return (
        <Main>
            <QuotesContainer>
                <Quotes />
            </QuotesContainer>
        </Main>
    );
};

const Main = styled.main`
    margin: 1rem;
`;

const QuotesContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60svh;
`;

const Quotes: React.FC = () => {
    const parsedQuotes = parseQuotes(quotes);

    const [quoteIndex, setQuoteIndex] = React.useState<number | undefined>();

    React.useEffect(() => {
        if (!quoteIndex) {
            const quoteIndex = randomInt(parsedQuotes.quotes.length);
            // Modify the current history entry to keep track of the quote that
            // we are initially showing. This is needed for the back to the
            // first quote to work.
            window.history.replaceState({ quoteIndex }, "");
            setQuoteIndex(quoteIndex);
        }
    }, []);

    // Follow the hyperlink from the given word (in the current quote) to some
    // other (randomly selected) quote. Update the display by using setQuote to
    // update the current quote.
    const traverse = (word: string) => {
        const { quoteIndicesForWord } = parsedQuotes;
        const key = word.toLowerCase();
        const linkedQuoteIndices = ensure(quoteIndicesForWord.get(key)).filter(
            (qi) => qi !== quoteIndex,
        );

        const newQuoteIndex = ensure(randomItem(linkedQuoteIndices));
        setQuoteIndex(newQuoteIndex);
        window.history.pushState({ quoteIndex: newQuoteIndex }, "");
    };

    const handlePopState = (event: PopStateEvent) => {
        const { state } = event;
        if (state && typeof state.quoteIndex === "number") {
            setQuoteIndex(state.quoteIndex);
        }
    };

    React.useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return quoteIndex !== undefined ? (
        <QuoteContainer {...{ quoteIndex }}>
            <Quote {...{ parsedQuotes, quoteIndex, traverse }} />
        </QuoteContainer>
    ) : (
        <Loading />
    );
};

interface QuoteContainerProps {
    quoteIndex: number;
}

/**
 * A container for a quote that animates the transition between them.
 *
 * @param quoteIndex A unique index for each quote.
 */
const QuoteContainer: React.FC<
    React.PropsWithChildren<QuoteContainerProps>
> = ({ quoteIndex, children }) => {
    return (
        <QuoteContainer_>
            <SwitchTransition>
                <CSSTransition
                    key={quoteIndex.toString()}
                    timeout={300}
                    classNames={"fade"}
                >
                    <div>{children}</div>
                </CSSTransition>
            </SwitchTransition>
        </QuoteContainer_>
    );
};

const QuoteContainer_ = styled.div`
    .fade-enter {
        opacity: 0;
        transform: scale3d(0.5, 0.5, 0.5);
    }
    .fade-enter-active {
        opacity: 1;
        transform: scale3d(1, 1, 1);
        transition:
            opacity 300ms ease-out,
            transform 300ms ease-out;
    }
    .fade-exit {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
    .fade-exit-active {
        opacity: 0;
        transform: scale3d(10, 10, 10);
        transition:
            opacity 300ms ease-in,
            transform 300ms ease-in;
    }
`;

interface QuoteProps {
    /** The parsed quote database */
    parsedQuotes: ParsedQuotes;
    /** The index of the parsed quote to show */
    quoteIndex: number;
    /** The function to call when the user clicks on the given word */
    traverse: (word: string) => void;
}

const Quote: React.FC<QuoteProps> = ({
    parsedQuotes,
    quoteIndex,
    traverse,
}) => {
    const parsedQuote = ensure(parsedQuotes.quotes[quoteIndex]);

    const makeHandleClick = (word: string) => {
        return (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            traverse(word);
        };
    };

    const segments = parsedQuote.map((item) => {
        if (typeof item === "string") {
            return <span>{item}</span>;
        } else {
            const word = ensure(item[0]);
            const key = word.toLowerCase();
            return (
                <a href="#" onClick={makeHandleClick(key)}>
                    {word}
                </a>
            );
        }
    });

    return (
        <Quote_>
            {segments.map((e, i) => (
                <React.Fragment key={i}>{e}</React.Fragment>
            ))}
        </Quote_>
    );
};

const Quote_ = styled.div`
    line-height: 1.3em;
    font-size: 2em;
    font-style: italic;

    a {
        text-decoration: none;
    }

    color: oklch(37% 0 0);
    a {
        background-color: lightyellow;
    }
    a:hover {
        background-color: lime;
        color: white;
    }

    @media (prefers-color-scheme: dark) {
        color: oklch(90% 0 0);
        a {
            background-color: ivory;
            color: oklch(30% 0 0);
        }
        a:hover {
            background-color: white;
            color: black;
        }
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
