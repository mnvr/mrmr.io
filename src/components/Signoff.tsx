import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const SignoffContents: React.FC = () => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedSignoffDate } = page;

    return (
        <small>
            Manav Rathi
            <br />
            {formattedSignoffDate}
        </small>
    );
};
