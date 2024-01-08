import * as C from "components/text/components";
import * as React from "react";
import styled from "styled-components";

/** A variation of Text layout for posts with the "note" attribute */
export const TextNoteLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <C.Container>
            <ExtraStyling>
                <C.Title />
                {children}
                <C.Signoff />
                <C.Footer />
            </ExtraStyling>
        </C.Container>
    );
};

export default TextNoteLayout;

const ExtraStyling = styled.div`
    blockquote {
        /* Override the font changes made by C.Container for its blockquote
         * children */
        font-family: system-ui, sans-serif;
        font-style: normal;
        /* Add a border at the left. This entails converting the margin into the
         * padding. */
        border-left: 1px solid currentColor;
        margin-inline: 0rem;
        padding-inline: 1.3rem;
    }
`;
