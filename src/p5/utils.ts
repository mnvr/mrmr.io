import p5Types from "p5";

/** Draw a grid onto the canvas */
export const grid = (p5: p5Types) => {
    const gap = 20;

    p5.push();
    lineGrid(p5, gap);
    pointGrid(p5, gap);
    p5.pop();
};

export const pointGrid = (p5: p5Types, gap: number) => {
    // The stroke controls the color and size of the point
    p5.stroke("blue");
    p5.strokeWeight(2);

    for (let y = gap; y < p5.height; y += gap) {
        for (let x = gap; x < p5.width; x += gap) {
            p5.point(x, y);
        }
    }
};

export const lineGrid = (p5: p5Types, gap: number) => {
    // The stroke controls the color and thickness of the line
    p5.stroke("lightgray");
    p5.strokeWeight(1);

    for (let y = gap; y < p5.height; y += gap) {
        p5.line(0, y, p5.width, y);
    }
    for (let x = gap; x < p5.width; x += gap) {
        p5.line(x, 0, x, p5.height);
    }
};
