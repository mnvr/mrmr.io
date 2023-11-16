import * as C from "components/text/components";
import * as React from "react";

export const TextLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <C.Container>
            <C.Title />
            {children}
            <C.Signoff />
            <C.Footer />
        </C.Container>
    );
};

export default TextLayout;
