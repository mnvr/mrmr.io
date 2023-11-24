import { Link } from "gatsby";
import * as React from "react";
import { RiInformationLine } from "react-icons/ri";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "styled-components";
import { ensure, ensureNumber } from "utils/ensure";
import { randomInt, randomItem } from "utils/random";
import { ParsedQuotes, parseQuotes } from "./parse";
import { quotes } from "./quotes";
import { timed } from "utils/debug";

export const Content: React.FC = () => {
    const parsedQuotes = timed(() => parseQuotes(quotes));

    return (
        <Main>
            <QuotesContainer>
                <Quotes {...{ parsedQuotes }} />
            </QuotesContainer>
            <Info />
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

interface QuotesProps {
    parsedQuotes: ParsedQuotes;
}

const Quotes: React.FC<QuotesProps> = ({ parsedQuotes }) => {
    // The index of the quote that we are currently showing. It indexes into the
    // `quotes` property of the `parsedQuotes` prop.
    //
    // This will be undefined initially, when we haven't yet shown the initial
    // quote. The initial quote is randomly selected, which happens on the
    // client, so this loading state cannot be optimized away by SSG.
    const [quoteIndex, setQuoteIndex] = React.useState<number | undefined>();
    // A history state counter that allows us to determine if we are going back
    // or forward. We increment this each time we do a `traverse`. Then, when
    // handling a "pophistory" event, we can compare this to the popped value to
    // determine the direction of travel.
    const [historyIndex, setHistoryIndex] = React.useState(0);
    // True if we are going back in history. This allows us to reverse the
    // direction of the animation.
    const [isReverse, setIsReverse] = React.useState(false);

    React.useEffect(() => {
        if (!quoteIndex) {
            const quoteIndex = randomInt(parsedQuotes.quotes.length);
            // Modify the current history entry to keep track of the quote that
            // we are initially showing. This is needed for the back to the
            // first quote to work.
            window.history.replaceState({ quoteIndex, historyIndex }, "");
            setQuoteIndex(quoteIndex);
            setIsReverse(false);
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
        const newHistoryIndex = historyIndex + 1;

        setQuoteIndex(newQuoteIndex);
        setHistoryIndex(newHistoryIndex);
        setIsReverse(false);

        window.history.pushState(
            { quoteIndex: newQuoteIndex, historyIndex: newHistoryIndex },
            "",
        );
    };

    const handlePopState = (event: PopStateEvent) => {
        const { state } = event;

        // When the user presses back from this page itself the
        // `removeEventListener` below runs after the page is destroyed. But
        // before that can happen, we end up here because of a spurious (not
        // meant for us) "popstate". This event will not have any state, and
        // this early return is to ignore it.
        if (!state) return;

        const poppedQuoteIndex = ensureNumber(state.quoteIndex);
        const poppedHistoryIndex = ensureNumber(state.historyIndex);

        // If the new history index we're get from the state is more than the
        // current history index, that means we're going forward (e.g. the user
        // pressed the forward button).
        const newIsReverse = poppedHistoryIndex <= historyIndex;

        setQuoteIndex(poppedQuoteIndex);
        setHistoryIndex(poppedHistoryIndex);
        setIsReverse(newIsReverse);
    };

    React.useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [historyIndex]);

    return quoteIndex !== undefined ? (
        <QuoteContainer {...{ quoteIndex, isReverse }}>
            <Quote {...{ parsedQuotes, quoteIndex, traverse }} />
        </QuoteContainer>
    ) : (
        <Loading />
    );
};

interface QuoteContainerProps {
    quoteIndex: number;
    isReverse: boolean;
}

/**
 * A container for a quote that animates the transition between them.
 *
 * @param quoteIndex A unique index for each quote.
 */
const QuoteContainer: React.FC<
    React.PropsWithChildren<QuoteContainerProps>
> = ({ quoteIndex, isReverse, children }) => {
    return (
        <QuoteContainer_>
            <SwitchTransition>
                <CSSTransition
                    key={quoteIndex.toString()}
                    timeout={300}
                    classNames={isReverse ? "fade-reverse" : "fade"}
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
        transition: 300ms ease-out;
    }
    .fade-exit {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
    .fade-exit-active {
        opacity: 0;
        transform: scale3d(10, 10, 10);
        transition: 300ms ease-in;
    }

    .fade-reverse-enter {
        opacity: 0;
        transform: scale3d(10, 10, 10);
    }
    .fade-reverse-enter-active {
        opacity: 1;
        transform: scale3d(1, 1, 1);
        transition: 300ms ease-out;
    }
    .fade-reverse-exit {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
    .fade-reverse-exit-active {
        opacity: 0;
        transform: scale3d(0.5, 0.5, 0.5);
        transition: 300ms ease-in;
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
    const quoteLength = ensure(parsedQuotes.quoteLengths[quoteIndex]);

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

    const fontSize = fontSizeForQuoteLength(quoteLength);

    return (
        <Quote_ {...{ fontSize }}>
            {segments.map((e, i) => (
                <React.Fragment key={i}>{e}</React.Fragment>
            ))}
        </Quote_>
    );
};

interface QuoteProps_ {
    fontSize: string;
}

const Quote_ = styled.div<QuoteProps_>`
    line-height: 1.3em;
    font-size: ${(props) => props.fontSize};
    font-style: italic;

    max-width: 30em;

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
            /* a transparent "darkslategray" */
            background-color: oklch(40.3% 0.038 195.76 / 42%);
            color: oklch(92% 0 0);
        }
        a:hover {
            color: black;
        }
    }
`;

const fontSizeForQuoteLength = (len: number) => {
    if (len > 300) return "1.4rem";
    if (len > 200) return "1.6rem";
    if (len > 80) return "1.8rem";
    return "2rem";
};

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

const Info: React.FC = () => {
    return (
        <Info_>
            <Link to="/quotes/about">
                <RiInformationLine size="2rem" title="About" />
            </Link>
        </Info_>
    );
};

const Info_ = styled.div`
    position: absolute;
    /* Same as the margin on Main */
    margin: 1rem;
    bottom: 0;
    right: 0;

    color: var(--mrmr-color-4);
    a:hover {
        color: var(--mrmr-color-1);
    }
`;
