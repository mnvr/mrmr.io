import type p5Types from "p5";

let gd = 0;

export const setup = (p5: p5Types) => {};

export const draw = (p5: p5Types) => {
    p5.background("lightblue");
    p5.stroke(102);
    {
        const gap = 20;
        for (let i = 0; i < (p5.width / gap) * 2; i += 1) {
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
    }
    {
        const gap = 22 + gd; // + Math.sin(p5.frameCount / 70) / 2;
        // p5.translate(p5Types.Vector.fromAngle(p5.frameCount / 1, 4));
        // p5.translate(-71, 1, 0);
        // p5.translate(0, -10, 0);
        // p5.translate(p5Types.Vector.fromAngle(p5.PI / 0, 19));
        // p5.translate(71, 71, 0);
        // p5.translate(p5.createVector(70.71067811865476, 70.71067811865474, 0));

        // console.log(p5Types.Vector.fromAngle(p5.PI / 4, 10));
        // console.log(p5Types.Vector.fromAngle(p5.frameCount / 1, 4));
        // console.log(gd);
        for (let i = 0; i < p5.width / gap; i += 1) {
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
        // p5.circle(50, 50, 10);
        // p5.translate(p5Types.Vector.fromAngle(p5.PI / 0, 19));
        // p5.stroke(p5Types.Color());
        p5.circle(150, 50, 10);
    }
};
