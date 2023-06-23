import type p5Types from "p5";

export const setup = (p5: p5Types) => {};

export const draw = (p5: p5Types) => {
    p5.background("lightblue");
    // p5.noStroke();
    // p5.strokeWeight(1);
    const gap = 40;
    for (let i = 0; i < 400 / gap; i += 1) {
        p5.line(2 + i * gap, 0, 2 + i * gap, 400);
    }
    // p5.ellipse(100, 100, 70, 70);
    // p5.ellipse(110, 100, 70, 70);
};
