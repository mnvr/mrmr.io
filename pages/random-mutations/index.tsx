import * as React from "react";
import styled from "styled-components";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const Content: React.FC = () => {
    return (
        <div>
            {/* <Title /> */}
            <CodeBlocks />
            <About />
        </div>
    );
};

const Title2: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { title } = page;

    return (
        <div>
            <h2>{title}</h2>
            <Signoff>
                <small>
                    Manav Rathi
                    <br />
                    Summer, 2019
                </small>
            </Signoff>
        </div>
    );
};

const Signoff = styled.p`
    margin-top: -0.5rem;
    color: var(--mrmr-color-3);
    margin-bottom: 2rem;
`;

const Content_ = styled.div`
    @media (min-width: 40em) {
        body {
            /* margin: 4em; */
        }
    }

    header p {
        margin-top: -0.5rem;
        opacity: 0.8;
        font-style: italic;
        margin-bottom: 2rem;
    }
`;

export const CodeBlocks: React.FC = () => {
    // prettier-ignore
    return (
        <CodeBlocks_>
            <div>
                <pre>
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
                </pre>
            </div>

            <div>
                <pre>
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
                </pre>
            </div>
        </CodeBlocks_>
    );
};

const CodeBlocks_ = styled.div`
    font-size: 13px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    margin-block: 2rem;

    b {
        color: red;
    }
`;

export const About: React.FC = () => {
    return (
        <About_>
            Tiny, single letter <b>random mutations</b> are enough for evolution
            to explore vast landscapes. A demonstration using code, but the same
            principle applies to single letter changes in DNA.
        </About_>
    );
};

const About_ = styled.p`
    font-size: 0.9rem;

    b {
        color: red;
    }
`;
