import React from "react";
import * as C from "./text";

/** A variation of Text layout for posts with the "hindi" attribute */
export const TextHindiLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return (
        <C.Container>
            <C.Title />
            {children}
            <C.SignoffHindi />
            <C.FooterHindi />
        </C.Container>
    );
};

export default TextHindiLayout;
