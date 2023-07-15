import p5Types from "p5";
import { color, p5c, setAlpha, type Colorish } from "utils/colorsjs";

interface GridOpts {
    gap?: number;
    stroke?: Colorish;
}

/** Draw a grid onto the canvas */
export const grid = (p5: p5Types, o = {} as GridOpts) => {
    p5.push();
    lineGrid(p5, o);
    pointGrid(p5, o);
    p5.pop();
};

export const pointGrid = (p5: p5Types, o = {} as GridOpts) => {
    const gap = o.gap ?? 20;

    // If a color is provided, use a transparent version of it. Otherwise use
    // the default "blue" (that goes well with the gray of the lines).
    const sc = o.stroke ? p5c(setAlpha(color(o.stroke), 0.5)) : "blue";

    // The stroke controls the color and size of the point
    p5.stroke(sc);
    p5.strokeWeight(2);

    for (let y = gap; y < p5.height; y += gap) {
        for (let x = gap; x < p5.width; x += gap) {
            p5.point(x, y);
        }
    }
};

export const lineGrid = (p5: p5Types, o = {} as GridOpts) => {
    const gap = o.gap ?? 20;

    // Use a transparent stroke that goes well with the (opaquer) stroke used in
    // the point grid. Otherwise use the default gray that also goes well with
    // the default blue of the point grid.
    const sc = o.stroke ? p5c(setAlpha(color(o.stroke), 0.1)) : "lightgray";

    // The stroke controls the color and thickness of the line
    p5.stroke(sc);
    p5.strokeWeight(1);

    for (let y = gap; y < p5.height; y += gap) {
        p5.line(0, y, p5.width, y);
    }
    for (let x = gap; x < p5.width; x += gap) {
        p5.line(x, 0, x, p5.height);
    }
};

interface DebugHUDOpts {
    stroke?: Colorish;
}

/** Show a debug value at the top left */
export const debugHUD = (p5: p5Types, s: string, o = {} as DebugHUDOpts) => {
    const c = p5c(color(o.stroke ?? "black"));
    p5.push();
    p5.fill(c);
    p5.strokeWeight(1);
    p5.stroke(c);
    p5.textFont("monospace");
    p5.textSize(16);
    p5.text(s, 5, 20);
    p5.pop();
};

/**
 * Invoke a function at every grid point spaced out with radius r
 *
 * The function will be invoked with the origin translated to the grid point.
 * Also, it is guaranteed that the center of the sketch will be a grid point.
 */
export const atEvery = (p5: p5Types, r: number, f: () => void) => {
    const [w, h] = [p5.width, p5.height];
    let [x0, y0] = [w / 2, h / 2];
    while (x0 > 0) x0 -= r;
    while (y0 > 0) y0 -= r;
    for (let y = y0; y < h; y += r) {
        for (let x = x0; x < w; x += r) {
            p5.push();
            p5.translate(x, y);
            f();
            p5.pop();
        }
    }
};
