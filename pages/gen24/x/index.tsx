import { Image } from "components/gen24/DayListing";
import * as React from "react";
import styled from "styled-components";

const Page: React.FC = () => {
    return (
        <div>
            <Card />
        </div>
    );
};

export default Page;

const Card: React.FC = () => {
    return (
        <Card_>
            <CardContent />
            <Image />
        </Card_>
    );
};

const Card_ = styled.div`
    margin: 1rem;
    background-color: aliceblue;
    padding: 1rem;
    max-width: 30rem;
`;

const CardContent: React.FC = () => {
    return <CardContent_>Hello</CardContent_>;
};

const CardContent_ = styled.div`
    background-color: rgba(255, 0, 0, 0.2);
`;
