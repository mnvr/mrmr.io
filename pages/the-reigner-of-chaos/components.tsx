import * as React from "react";
import styled from "styled-components";

export const Sketch: React.FC = () => {
    const [digits, setDigits] = React.useState<string[] | undefined>();

    React.useEffect(() => {
        const count = 1000;
        const numbers = new Uint8Array(count);
        crypto.getRandomValues(numbers);

        const newDigits = new Array(count);
        numbers.forEach((n, i) => {
            newDigits[i] = (n % 10).toString();
        });

        setDigits(newDigits);
    }, []);

    React.useEffect(() => {
        const handleScroll = (event) => {
            console.log(event);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!digits) return <div />;

    return (
        <Sketch_>
            {digits.map((d, i) => {
                return <Cell key={i}>{d}</Cell>;
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
