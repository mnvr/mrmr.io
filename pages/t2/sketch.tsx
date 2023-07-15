import p5Types from "p5";
import { atEvery } from "p5/utils";

export const draw = (p5: p5Types) => {
    p5.clear();
    p5.background(250);

    const r = 50;
    const gap = Math.abs(Math.sin(p5.frameCount / 100)) * r * 0.8;
    let rot = Math.sin(p5.frameCount / 100);
    atEvery(p5, r * 4, () => {
        // p5.translate(p5.width / 2, p5.height / 2);
        p5.rotate(rot);
        rot += Math.PI / 2;
        tile(p5, r, gap);
    });
};

const tile = (p5: p5Types, r: number, gap: number) => {
    p5.push();
    p5.stroke(80, 200);
    p5.fill(252, 150);

    // Overlap
    const ov = gap - r / 2;
    const rov = r + ov;

    // The original positions - we'll mark these with points.
    const dx = r * Math.sin(Math.PI / 3);
    const dy = r * Math.cos(Math.PI / 3);

    // The shifted / gapped positions - we'll draw the circles here.
    const dxov = rov * Math.sin(Math.PI / 3);
    const dyov = rov * Math.cos(Math.PI / 3);

    p5.strokeWeight(10);
    p5.point(0, 0);
    p5.point(0, -r);
    p5.point(-dx, dy);
    p5.point(+dx, dy);
    p5.strokeWeight(1);

    const cr = r * Math.sqrt(3);

    p5.circle(0, -rov, cr);
    p5.circle(-dxov, dyov, cr);
    p5.circle(+dxov, dyov, cr);

    p5.pop();
};
