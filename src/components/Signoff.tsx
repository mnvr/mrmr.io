import * as React from "react";
import { BuildTimePageContext } from "templates/page";
import { ensure } from "utils/ensure";

export const SignoffContents: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
    props,
) => {
    const page = ensure(React.useContext(BuildTimePageContext));
    const { formattedSignoffDate } = page;

    return (
        <div {...props}>
            <small>
                Manav Rathi
                <br />
                {formattedSignoffDate}
            </small>
        </div>
    );
};
