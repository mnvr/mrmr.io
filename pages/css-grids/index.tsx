import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <div>
            <E1 />
            <E2 />
        </div>
    );
};

const Bordered = styled.div`
    p {
        font-size: smaller;
        color: var(--mrmr-color-3);
        margin-block: 0;

        b {
            color: var(--mrmr-color-1);
            font-weight: normal;
        }
    }

    div {
        border: 1px dashed currentColor;
    }

    div > div {
        padding: 10px;
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

const E1: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>Default Flexbox</b>
            </p>
            <DefaultFlex />
        </Bordered>
    );
};

const DefaultFlex = styled(C6)`
    display: flex;
`;

const E2: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>Default Grid. </b>
                Unlike Flexbox, the items don't look any different from the
                normal flow because the default is a one column grid.
            </p>
            <DefaultGrid />
        </Bordered>
    );
};

const DefaultGrid = styled(C6)`
    display: grid;
`;
