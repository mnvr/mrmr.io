import { LinkStyleUnderlined } from "components/LinkStyles";
import * as T from "components/text/components";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Main>
            <T.Title />
            <CodeBlocks />
            <About />
            <T.Signoff />
            <LinkStyleUnderlined>
                <T.Footer />
            </LinkStyleUnderlined>
        </Main>
    );
};

const Main = styled.main`
    margin: 1rem;
    @media (min-width: 30rem) {
        margin: 2rem;
    }
`;

export const CodeBlocks: React.FC = () => {
    // prettier-ignore
    return (
        <CodeBlocks_>
            <div>
                <pre>
                    <code>
def <b>dfs</b>(s, adj):<br/>
{"    "}xs = [s]<br/>
{"    "}visited = set()<br/>
{"    "}while xs:<br/>
{"        "}u = xs.pop()<br/>
{"        "}if u not in visited:<br/>
{"            "}print(u)<br/>
{"            "}visited.add(u)<br/>
{"            "}for v in adj.get(u, []):<br/>
{"                "}xs.append(v)<br/>
                    </code>
                </pre>
            </div>

            <div>
                <pre>
                    <code>
def <b>bfs</b>(s, adj):<br/>
{"    "}xs = [s]<br/>
{"    "}visited = set()<br/>
{"    "}while xs:<br/>
{"        "}u = xs.pop(<b>0</b>)<br/>
{"        "}if u not in visited:<br/>
{"            "}print(u)<br/>
{"            "}visited.add(u)<br/>
{"            "}for v in adj.get(u, []):<br/>
{"                "}xs.append(v)<br/>
                    </code>
                </pre>
            </div>
        </CodeBlocks_>
    );
};

const CodeBlocks_ = styled.div`
    font-size: 14px;
    line-height: 1.4;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    margin-block-end: 2em;

    b {
        /* See: [Note: Variable width monospace font] */
        font-weight: 400;
        color: var(--mrmr-highlight-color);
    }
`;

export const About: React.FC = () => {
    return (
        <About_>
            <p>
                Tiny, single letter <b>random mutations</b> are enough for
                evolution to explore vast landscapes. A demonstration using
                code, but the same principle applies to single letter changes in
                DNA.
            </p>

            <p>
                The code on the left (<code>dfs</code>) does a depth first
                search, the code on the right (<code>bfs</code>) does a breath
                first search. These are two entirely different algorithms, with
                entirely different outcomes. Yet the difference in the code
                between the two is just a single letter (The extra{" "}
                <code>0</code> in the <code>bfs</code> version).
            </p>

            <p>
                It is totally conceivable to imagine a mindless evolutionary
                process that makes this single letter "mistake" when copying
                over the code (or DNA), and ends up with an entirely different
                organism than its peers. Thereafter, it is just lather, rinse
                and repeat.
            </p>
        </About_>
    );
};

const About_ = styled.div`
    font-size: 0.9rem;
    max-width: 36rem;
    line-height: 1.4;

    p:first-child b {
        color: var(--mrmr-highlight-color);
    }
`;
