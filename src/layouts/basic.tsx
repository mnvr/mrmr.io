import { Column } from "components/Column";
import * as React from "react";

export const BasicLayout: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <Column>{children}</Column>;
};

export default BasicLayout;
