import * as React from "react";
import styled from "styled-components";

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

export const Sketch: React.FC = () => {
    const [gridData, setGridData] = React.useState<GridData | undefined>();

    React.useEffect(() => {
        const count = 1000;
        setGridData(makeGridData(count));
    }, []);

    React.useEffect(() => {
        const handleScroll = () => {
            console.log("scroll");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!gridData) return <div />;

    return (
        <Sketch_>
            {gridData.map(({ s }, i) => {
                return <Cell key={i}>{s}</Cell>;
            })}
        </Sketch_>
    );
};

const Sketch_ = styled.div`
    display: grid;
    grid-template-columns: repeat(30, 1fr);
    gap: 2px;
    /* background-color: red; */

    div {
        /* background-color: navy; */
    }
`;

interface CellProps {
    digits: number;
    i: number;
}

const Cell: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};
