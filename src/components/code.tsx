import React, { PropsWithChildren } from "react";

const codeStyles = {
    color: "#8A6534",
    padding: 4,
    backgroundColor: "#FFF4DB",
    fontSize: "1.25rem",
    borderRadius: 4,
};

const Code: React.FC<PropsWithChildren> = ({ children }) => {
    return <code style={codeStyles}>{children}</code>;
};

export default Code;
