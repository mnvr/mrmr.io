import { Link } from "gatsby";
import * as React from "react";
import { RiInformationLine } from "react-icons/ri";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "styled-components";
import { ensure, ensureNumber } from "utils/ensure";
import { randomInt, randomItem } from "utils/random";
import { parseQuotes, type ParsedQuotes } from "./parse";
import { quotes } from "./quotes";

export const Content: React.FC = () => {
    const parsedQuotes = parseQuotes(quotes);

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
        window.history.pushState({ quoteIndex: newQuoteIndex }, "");
        setQuoteIndex(newQuoteIndex);
    };

    const handlePopState = (event: PopStateEvent) => {
        const { state } = event;

        // When the user presses back from this page itself the
        // `removeEventListener` below runs after the page is destroyed. But
        // before that can happen, we end up here because of a spurious (not
        // meant for us) "popstate".
        //
        // Such a spurious event might not have any state, or might not have
        // state of the form that we expect. So only proceed if we recognize the
        // shape of the state.
        if (!state) return;
        if (typeof state.quoteIndex !== "number") return;

        const poppedQuoteIndex = ensureNumber(state.quoteIndex);
        setQuoteIndex(poppedQuoteIndex);
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
    }
    .fade-enter-active {
        opacity: 1;
        transition: 300ms ease-out;
    }
    .fade-exit {
        opacity: 1;
    }
    .fade-exit-active {
        opacity: 0;
        transition: 300ms ease-out;
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
                <RiInformationLine title="About" />
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

    /* See Note: [Workaround - Safari doesn't support rem units on SVG elements] */
    font-size: 2rem;

    color: var(--mrmr-tertiary-color);
    a:hover {
        color: var(--mrmr-text-color);
    }
`;
