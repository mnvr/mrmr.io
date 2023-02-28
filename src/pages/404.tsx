import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Code from "components/Code";

const pageStyles = {
    color: "#232129",
    padding: "96px",
    fontFamily: "system-ui, sans-serif",
};

const headingStyles = {
    marginTop: 0,
    marginBottom: 64,
    maxWidth: 320,
};

const paragraphStyles = {
    marginBottom: 48,
};

const NotFoundPage: React.FC<PageProps> = () => {
    return (
        <main style={pageStyles}>
            <h1 style={headingStyles}>Page not found</h1>
            <p style={paragraphStyles}>
                Sorry 😔, we couldn’t find what you were looking for.
                <br />
                {process.env.NODE_ENV === "development" ? (
                    <>
                        <br />
                        Try creating a page in <Code>src/pages/</Code>.
                        <br />
                    </>
                ) : null}
                <br />
                <Link to="/">Go home</Link>.
            </p>
        </main>
    );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
