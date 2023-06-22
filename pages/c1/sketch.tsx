import type p5Types from "p5";

export const setup = (p5: p5Types) => {};

export const draw = (p5: p5Types) => {
    p5.ellipse(100, 100, 70, 70);
    p5.ellipse(110, 100, 70, 70);
};
