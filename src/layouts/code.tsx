import * as C from "components/code/components";
import * as React from "react";

/** An almost unstyled page layout with minimal CSS styling for code blocks */
export const CodeLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <C.Container>{children}</C.Container>;
};

export default CodeLayout;
