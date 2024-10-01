import { parseQuotes } from "../pages/quotes/parse";
import { quotes } from "../pages/quotes/quotes";
import { ensure, ensureNumber } from "../src/utils/ensure";
import { randomInt, randomItem } from "../src/utils/random";

export const parsedQuotes = parseQuotes(quotes);

export const fontSizeForQuoteLength = (len: number) => {
    if (len > 300) return "1.4rem";
    if (len > 200) return "1.6rem";
    if (len > 80) return "1.8rem";
    return "2rem";
};

// The index of the quote that we are currently showing. It indexes into
// {@link quotes} property of {@link parsedQuotes}.
//
// This will be undefined initially, when we haven't yet shown the initial
// quote. The initial quote is randomly selected on page load.

let _quoteIndex: number | undefined;

const loadInitialQuote = () => {
    const quoteIndex = randomInt(parsedQuotes.quotes.length);
    // Modify the current history entry to keep track of the quote that
    // we are initially showing. This is needed for the back to the
    // first quote to work.
    window.history.replaceState({ quoteIndex }, "");
    showQuoteAtIndex(quoteIndex);
};

const showQuoteAtIndex = (i: number) => {
    _quoteIndex = i;
    const quote = parsedQuotes.quotes[i];
    const output = document.getElementsByTagName("output")[0];
    console.log(parsedQuotes)
    output.innerText = quote.toString();
};

// Follow the hyperlink from the given word (in the current quote) to some
// other (randomly selected) quote. Update the display by using showQuoteAtIndex to
// update the current quote.
export const traverse = (word: string) => {
    const { quoteIndicesForWord } = parsedQuotes;
    const key = word.toLowerCase();
    const linkedQuoteIndices = ensure(quoteIndicesForWord.get(key)).filter(
        (qi) => qi !== _quoteIndex,
    );

    const quoteIndex = ensure(randomItem(linkedQuoteIndices));
    window.history.pushState({ quoteIndex }, "");
    showQuoteAtIndex(quoteIndex);
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

    showQuoteAtIndex(ensureNumber(state.quoteIndex));
};

export const init = () => {
    window.addEventListener("popstate", handlePopState);
    loadInitialQuote();
};
