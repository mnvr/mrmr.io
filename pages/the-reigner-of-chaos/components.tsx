import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <Sketch />
        </Content_>
    );
};

const Content_ = styled.div`
    min-height: 500vh;
`;

/** Data for each entry in the grid */
interface CellData {
    /** A Uint8 value, randomly assigned on page load. */
    n: number;
    /**
     * An arbitrarily interpreteable internal state associated with this cell.
     * e.g. we use it decide when to switch colors of the cell as the user
     * scrolls.
     *
     * Randomly assigned on page load.
     */
    h: number;
    /**
     * The string to outwardly represent this cell in the grid. e.g. the last
     * digit of the gene.
     */
    s: string;
}

type GridData = CellData[];

const makeGridData = (cellCount: number): GridData => {
    const numbers = new Uint8Array(cellCount);
    crypto.getRandomValues(numbers);

    return [...numbers].map((n) => {
        const s = (n % 10).toString();
        const h = n / 256;
        return { n, h, s };
    });
};

const Sketch: React.FC = () => {
    const [gridData, setGridData] = React.useState<GridData | undefined>();
    const [percentage, setPercentage] = React.useState(0);

    React.useEffect(() => {
        const count = 100;
        setGridData(makeGridData(count));
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            setPercentage(window.scrollY / (document.body.scrollHeight - window.innerHeight));
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!gridData) return <div />;

    return (
        <>
            <Sketch_>
                {gridData.map(({ s }, i) => {
                    return <Cell key={i}>{s}</Cell>;
                })}
            </Sketch_>
            <Percentage {...{ percentage }} />
        </>
    );
};

const Sketch_ = styled.div`
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    gap: 2px;
    background-color: green;
    /* position: fixed; */
    width: 100%;
    height: 90svh;

    div {
        /* background-color: navy; */
    }
`;

interface PercentageProps {
    percentage: number;
}
const Percentage: React.FC<PercentageProps> = ({ percentage }) => {
    return <Percentage_>{Math.round(percentage * 100)}%</Percentage_>;
};

const Percentage_ = styled.div`
    background-color: navy;
    color: red;

    position: fixed;
    inset-block-end: 0;
    inset-inline-end: 0;
`;

interface CellProps {
    digits: number;
    i: number;
}

const Cell: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};
