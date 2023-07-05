import type p5Types from "p5";
import { grid } from "p5/utils";

export const draw = (p5: p5Types) => {
    // Using clear instead background here because clear clears out the canvas
    // to a transparent background. This way, we do not need to specify the
    // background color as a p5.Color, and can use a more vibrant color
    // specified e.g. using OKLCH.
    p5.clear();

    grid(p5);

    p5.rectMode(p5.CENTER);

    p5.rotate(p5.PI / 4);

    p5.fill("#ed033f");
    p5.strokeWeight(0);
    // p5.stroke(33);
    p5.circle(100, 100, 133);

    p5.fill("#f3ae58");
    p5.rect(100, 100, 70, 70);

    p5.fill("#ed033f");
    p5.strokeWeight(0);
    // p5.stroke(33);
    p5.circle(100, 100, 30);

    p5.noFill();
    p5.stroke("#ed033f");
    p5.strokeWeight(1);
    p5.arc(0, 0, 100, 100, 0, 4);
};
