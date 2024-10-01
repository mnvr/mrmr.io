import { ensure } from "./ensure.ts";

const ignoredWords: string[] = ["the", "it", "a", "an", "this", "that", "and"];

export interface ParsedQuotes {
  /** An array of {@link ParsedQuote}s. */
  quotes: ParsedQuote[];
  /**
   * The lengths of the underlying text for each (correspondingly indexed)
   * {@link quote}.
   */
  quoteLengths: number[];
  /**
   * A map from words to the quotes that the word occurs in.
   *
   * The key is the (lowercased) word. The value is an conceptually an array
   * of quotes, which are represented by an array of indices into the
   * {@link quotes} array.
   */
  quoteIndicesForWord: Map<string, number[]>;
}

/**
 * A quote parsed into segments.
 *
 * Each segment is either:
 *
 * - a normal text span, represented by a string;
 *
 * - or a word link, which is represented by a singleton list containing the
 *   link word.
 */
export type ParsedQuote = (string | string[])[];

/**
 * Parse the array of quotes into the {@link ParsedQuotes} data structure which
 * is amenable to hyperlinking of the form that we want to do here.
 */
export const parseQuotes = (quotes: string[]): ParsedQuotes => {
  /*
     The parsing works in two passes.

     1. First we find all linkable words (and the indicies of the quotes that
        they link to).

     2. Then we go through each quote character by character, splitting it
        into segments of normal text, and links.
     */
  const quoteIndicesForWord = parseQuoteIndicesForWord(quotes);
  const parsedQuotes = quotes.map((quote) =>
    parseQuote(quote, quoteIndicesForWord),
  );
  const quoteLengths = quotes.map((quote) => quote.length);
  ensureNoDeadEnds(parsedQuotes);
  return {
    quotes: parsedQuotes,
    quoteLengths,
    quoteIndicesForWord,
  };
};

/**
 * Return a set of words (as keys) that occur in more than one quote.
 *
 * For each such word, also return the indices of the quotes in which it occurs.
 *
 * Word "key" here means that all words are lowercased first so that they can be
 * deterministically used as a key irrespective of the case in which they occur
 * in the sentence.
 */
const parseQuoteIndicesForWord = (quotes: string[]) => {
  const quoteIndicesForWord = new Map<string, number[]>();

  quotes.forEach((quote, i) => {
    potentialWords(quote).forEach((word) => {
      quoteIndicesForWord.set(
        word,
        (quoteIndicesForWord.get(word) ?? []).concat([i]),
      );
    });
  });

  // Remove words that only link to one quote (which will just be itself).
  for (const word of quoteIndicesForWord.keys()) {
    if (ensure(quoteIndicesForWord.get(word)).length === 1) {
      quoteIndicesForWord.delete(word);
    }
  }

  return quoteIndicesForWord;
};

/**
 * Break a string down into its component segments
 *
 * This split is considered "potential" because consists of potential words, vs
 * everything else. Some of these words might not turn out to be links (e.g. if
 * they don't occur elsewhere, or are an ignored word).
 */
const potentialSegments = (s: string) => {
  // Note: [Iterating over Strings]
  //
  // Iterating strings by what we think of as a "character" is disjointed from
  // the JavaScript string reality in two levels:
  //
  // Firstly, JavaScript strings are sequences of UTF-16 code points, not
  // Unicode code points. If we think of them as arrays, then they're arrays
  // of UTF-16 code points, and array indexing (or the almost equivalent
  // `charAt` method) returns UTF-16 code points, not Unicode code points.
  //
  // From the MDN docs of charAt:
  //
  // > charAt returns a new string consiting of the single UTF-16 code unit at
  //   the given index. charAt always indexes the string as a sequence of
  //   UTF-16 code units, so it may return lone surrogates.
  //
  // We can solve this problem by using the string iterator though, which
  // yields the Unicode code points of the string as individual strings. The
  // string iterator is what gets used if we use the spread syntax or
  // `for...of` loops, so if we use either of those, we're good.
  //
  // Secondly, a single "character" (technically a grapheme) can be composed
  // of multiple Unicode code points. A common example is a thumbs up emoji,
  // which can be composed of a base emoji plus a skin tone. From MDN:
  //
  // > Strings are iterated by Unicode code points. This means grapheme
  //   clusters will be split, but surrogate pairs will be preserved.
  //
  // Luckily for our quotes dataset, we don't (yet) have any such characters
  // so we don't need to solve this problem.

  const segments: ParsedQuote = [];
  let currentWord: string[] = [];
  let currentNonWord: string[] = [];
  s = s.trim();
  for (const c of s) {
    if (/[\w'’]/.test(c)) {
      // - c is an alphanumeric word character from the basic Latin alphabet
      //  (including the underscore),
      // - or c is one of ’ or '. While these can be punctuation marks, in
      //   our quotes DB we only have them in words like "don't", "won't".
      currentWord.push(c);
      if (currentNonWord.length) {
        segments.push(currentNonWord.join(""));
        currentNonWord = [];
      }
    } else {
      currentNonWord.push(c);
      if (currentWord.length) {
        segments.push([currentWord.join("")]);
        currentWord = [];
      }
    }
  }
  if (currentNonWord.length) segments.push(currentNonWord.join(""));
  if (currentWord.length) segments.push([currentWord.join("")]);
  return segments;
};

/**
 * Return an array of potential words from the given string.
 *
 * This is a specialization of {@link potentialSegments} that discards
 * non-words, and flattens the nested arrays into an array of unique words
 * whilst also discarding ignored words.
 */
const potentialWords = (s: string): string[] =>
  [
    ...new Set(
      potentialSegments(s)
        .flatMap((sg) => (typeof sg === "string" ? [] : sg))
        .map((w) => w.toLowerCase()),
    ),
  ].filter((w) => !ignoredWordSet.has(w));

/**
 * A set of common / filler words like "is", "the" etc that we ignore when
 * considering what words to hyperlink.
 */
const ignoredWordSet = new Set<string>(ignoredWords);

/**
 * Break a quote string down into segments (normal text or links to words).
 *
 * @param quote The quote string to parse.
 * @param quoteIndicesForWord A map keyed by (lowercased) words, to the indices
 * of the quotes in which that word occurs.
 *
 * Only the first occurence of a word in the string is linked.
 */
const parseQuote = (
  quote: string,
  quoteIndicesForWord: Map<string, number[]>,
): ParsedQuote => {
  const hasBeenLinked = new Set<string>();
  return consolidateSegments(
    potentialSegments(quote).map((sg) => {
      if (typeof sg === "string") {
        // Return non-word segments as it is.
        return sg;
      } else {
        // Keep words that are linkable, otherwise convert them to non-word
        // segments (later on we'll consolidate them too when possible).
        const word = ensure(sg[0]);
        const key = word.toLowerCase();
        if (quoteIndicesForWord.get(key) && !hasBeenLinked.has(key)) {
          hasBeenLinked.add(key);
          return sg;
        } else {
          return word;
        }
      }
    }),
  );
};

/**
 * Combine consecutive non-word segments into a single one.
 *
 * This reduces the number of `<span/>`s that are created in the DOM.
 */
const consolidateSegments = (segments: ParsedQuote): ParsedQuote =>
  segments.reduce(
    (res, sg) => {
      const n = res.length;
      if (typeof sg === "string" && n && typeof res[n - 1] === "string") {
        const combined = [res[n - 1], sg].join("");
        return res.slice(0, n - 1).concat([combined]);
      }
      return res.concat([sg]);
    },
    [] as typeof segments,
  );

/**
 * Throw an exception if any of the quotes are dead ends (i.e. there is even
 * one quote that does not have links to others).
 *
 * This is primarily meant to be a compile time sanity check. To rectify this,
 * we need to change the quote database to add more quotes, or create an alias.
 */
const ensureNoDeadEnds = (quotes: ParsedQuote[]) =>
  quotes.forEach((q, i) => {
    if (!hasAtLeastOneLink(q))
      throw new Error(
        `A quote should have at least one outgoing link from it. But the quote at index ${i} doesn't; the quote is: ${q}`,
      );
  });

/** Return true if the given {@link ParsedQuote} has at least one link */
const hasAtLeastOneLink = (quote: ParsedQuote) =>
  !quote.every((sg) => typeof sg === "string");
