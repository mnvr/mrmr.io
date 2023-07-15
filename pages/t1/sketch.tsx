import p5Types from "p5";
import { atEvery } from "p5/utils";

export const draw = (p5: p5Types) => {
    p5.clear();
    p5.background(250);

    const r = 100;
    atEvery(p5, r, () => {
        dot(p5, 0, 0);
        eqt(p5, r);
    });
};

// A shape based on an equilateral triangle, circumscribed by a circle with
// radius r and centered at the origin.
//
// This is a useful primitive since an equilateral tiling fills up the plane.
const eqt = (p5: p5Types, r: number) => {
    p5.push();
    p5.stroke(80, 200);
    p5.fill(252, 150);

    const d = r * 2;

    p5.quad(-r, -r, r, -r, r, r, -r, r);
    p5.circle(0, 0, d);

    // The geometric center of an equilateral triangle is also the center of its
    // circumcircle. By visual inspection, we find that we can compute the x and
    // y offsets ofthe bottom two points of the equilateral triangle in terms of
    // the sin / cos 30 degrees.
    const dx = r * Math.sin(Math.PI / 3);
    const dy = r * Math.cos(Math.PI / 3);

    dot(p5, 0, -r);
    dot(p5, 0, 0);
    dot(p5, -dx, dy);
    dot(p5, +dx, dy);

    p5.triangle(0, -r, -dx, dy, +dx, dy);

    p5.circle(0, -r, r);
    p5.circle(-dx, dy, r);
    p5.circle(+dx, dy, r);

    // The radius of the circumscribed circle of an equilateral triangle is
    // `R = a / √3`.
    const a = r * Math.sqrt(3);

    // Which gives us the radius of the circle we should draw at each vertex
    // such that they touch.
    const cr = a;

    p5.circle(0, -r, cr);
    p5.circle(-dx, dy, cr);
    p5.circle(+dx, dy, cr);

    p5.pop();
};

const dot = (p5: p5Types, x: number, y: number) => {
    p5.push();
    p5.stroke(0);
    p5.strokeWeight(5);
    p5.point(x, y);
    p5.pop();
};
