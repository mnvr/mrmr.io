import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <div>
            <Example1 />
        </div>
    );
};

const Bordered = styled.div`
    div {
        border: 1px dashed currentColor;
    }
`;

const C6: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div {...props}>
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
        </div>
    );
};

const Example1: React.FC = () => {
    return (
        <Bordered>
            Default Grid
            <DefaultGrid />
        </Bordered>
    );
};

const DefaultGrid = styled(C6)`
    display: grid;

    div {
        padding: 10px;
    }
`;
