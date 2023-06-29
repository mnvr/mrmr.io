import type p5Types from "p5";

let gd = 0;

export const setup = (p5: p5Types) => {
    // p5.frameRate(3);
    // p5.noLoop();
};

export const draw = (p5: p5Types) => {
    p5.background("lightblue");
    p5.stroke(100 + 2 * Math.abs(gd));
    // p5.noStroke();
    p5.strokeWeight(1);
    {
        const gap = 20;
        for (let i = 0; i < (p5.width / gap) * 2; i += 1) {
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
    }
    p5.stroke(100 + 2 * gd);
    // p5.strokeWeight(1);
    {
        // const gap = 22 + Math.abs(Math.sin(p5.frameCount / 100) * 5);
        const gap = 22 + gd + Math.sin(p5.frameCount / 7) / 2;
        // console.log(gap);
        // gd = (gd + 1) % 10;
        // gd +=
        console.log(gd);
        // if (gd === 0) {
        //     gd = 1;
        // } else if (gd === 1) {
        //     gd = 2;
        // } else if (gd === 2) {
        //     gd = -1;
        // } else if (gd === -1) {
        //     gd = 0;
        // }
        if (p5.frameCount % 17 === 0) gd--;
        if (p5.frameCount % 19 === 0) gd++;
        gd %= 24;
        console.log(gd);
        for (let i = 0; i < p5.width / gap; i += 1) {
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
    }
    // p5.ellipse(100, 100, 70, 70);
    // p5.ellipse(110, 100, 70, 70);
};
