import * as C from "components/text/components";
import * as React from "react";

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
