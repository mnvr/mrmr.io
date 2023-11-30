import { ExternalLink } from "components/ExternalLink";
import * as React from "react";
import styled from "styled-components";

export const Content: React.FC = () => {
    return (
        <Content_>
            <E0 />
            <E1 />
            <E2 />
            <E3 />
            <E4 />
            <E5 />
            <E6 />
            <E7 />
            <E8 />
            <E9 />
            <E10 />
            <E11 />
            <E12 />
        </Content_>
    );
};

const Content_ = styled.div`
    display: flex;
    flex-direction: column;
    & > div {
        margin: 10px;
    }

    --mrmr-highlight-color: aliceblue;
    @media (prefers-color-scheme: dark) {
        --mrmr-highlight-color: darkslateblue;
    }
`;

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

const E0: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>CSS grid playground.</b> Based on the excellent{" "}
                <ExternalLink href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids">
                    MDN intro to grids
                </ExternalLink>
                .
            </p>
        </Bordered>
    );
};

const E1: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>Default flexbox</b>
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
                <b>Default grid. </b>Unlike Flexbox, the items don't look any
                different from the normal flow because the default is a one
                column grid.
            </p>
            <DefaultGrid />
        </Bordered>
    );
};

const DefaultGrid = styled(C6)`
    display: grid;
`;

const E3: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>Adding Column Tracks. </b>We can use any length or percentage
                unit (here 200px).
            </p>
            <G1 />
        </Bordered>
    );
};

const G1 = styled(C6)`
    display: grid;
    grid-template-columns: 200px 200px 200px;
`;

const E4: React.FC = () => {
    return (
        <Bordered>
            <p>
                Use the <b>fr (fraction) unit</b> to create flexibly sized
                tracks.
            </p>
            <Fr1 />
        </Bordered>
    );
};

const Fr1 = styled(C6)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const E5: React.FC = () => {
    return (
        <Bordered>
            <p>
                <b>fr</b> distributes available space, not all space, so large
                items will result in less space to share.
            </p>
            <Fr2 />
        </Bordered>
    );
};

const Fr2 = styled(C6)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    div:nth-child(3) {
        background-color: var(--mrmr-highlight-color);
        min-width: 300px;
    }
`;

const E6: React.FC = () => {
    return (
        <Bordered>
            <p>
                We can create <b>gap</b>s between tracks. And we can use the{" "}
                <b>repeat</b> function to repeat tracks.
            </p>
            <Gap />
        </Bordered>
    );
};

const Gap = styled(C6)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
`;

const E7: React.FC = () => {
    return (
        <Bordered>
            <p>
                Columns created so far were explicit, but rows were implicitly
                created. Such implicit tracks are sized <b>auto</b> by default
                (large enough to hold their content), but can also be given a
                size.
            </p>
            <Implicit />
        </Bordered>
    );
};

const Implicit = styled(C6)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 20px;
`;

const E8: React.FC = () => {
    return (
        <Bordered>
            <p>
                Above we picked a size that is not enough to host the contents.
                We can use the <b>minmax</b> function to specify both a minimum
                and a maximum size for the track.
            </p>
            <Implicit2 />
        </Bordered>
    );
};

const Implicit2 = styled(C6)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(20px, auto);
    div:nth-child(even) {
        padding: 0;
        font-size: 60%;
    }
`;

const E9: React.FC = () => {
    return (
        <Bordered>
            <p>
                Note how the minmaxing applies to the entire track (row in this
                case). Since we are using <b>auto</b> as the maximum size, the
                entire track (second row) expands to fit the content.
            </p>
            <Implicit3 />
        </Bordered>
    );
};

const Implicit3 = styled(C6)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(20px, auto);

    /* first six elements */
    div:nth-child(-n + 6) {
        padding: 0;
        font-size: 60%;
    }
`;

const E10: React.FC = () => {
    return (
        <Bordered>
            <p>
                We can generate as many columns as will fit by passing{" "}
                <b>auto-fit</b> to repeat.
            </p>
            <AutoFit />
        </Bordered>
    );
};

const AutoFit = styled(C6)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
`;

const E11: React.FC = () => {
    return (
        <Bordered>
            <p>
                It would be nice to combine this with content aware track size,
                say minmax(70px, auto), or minmax(70px, <b>max-content</b>). But
                that doesn't work (try squishing the grid down).
            </p>
            <MaxContent />
            <p>
                This is because "automatic repetitions (auto-fill or auto-fit)
                cannot be combined with intrinsic or flexible sizes
                (min-content, max-content, auto, fit-content())".
                <sup>
                    <ExternalLink href="https://stackoverflow.com/questions/52764726/css-grid-auto-fit-with-max-content">
                        †
                    </ExternalLink>
                </sup>
            </p>
        </Bordered>
    );
};

const MaxContent = styled(C6)`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, max-content));
    div:nth-child(3) {
        background-color: var(--mrmr-highlight-color);
        font-size: 3rem;
    }
`;

const E12: React.FC = () => {
    return (
        <Bordered>
            <p>
                This illustrates how grid is not a replacement for flexbox, but
                is more complementary. The content-aware overflow of cells can
                achieved using flexbox, but notice how the tracks are not the
                same size. flex and grid just simply have different primitives
                and cover different design spaces.
            </p>
            <MaxContentFlex />
        </Bordered>
    );
};

const MaxContentFlex = styled(C6)`
    display: flex;
    flex-wrap: wrap;
    grid-template-columns: repeat(auto-fit, minmax(70px, max-content));
    div:nth-child(3) {
        background-color: var(--mrmr-highlight-color);
        font-size: 3rem;
    }
    div {
        flex-grow: 1;
    }
`;
