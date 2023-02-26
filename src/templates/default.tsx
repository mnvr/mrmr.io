import React from "react";
import { HeadFC, PageProps } from "gatsby";

const Page: React.FC<PageProps> = () => {
    return <>Body</>;
};

export default Page;

export const Head: HeadFC = () => <title>Test</title>;
