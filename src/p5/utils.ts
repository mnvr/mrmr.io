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

interface FrameCountOpts {
    stroke?: Colorish;
}

/** Show the frameCount and milliseconds at the top left */
export const showFrameCount = (p5: p5Types, o = {} as FrameCountOpts) => {
    const c = p5c(color(o.stroke ?? "black"));
    p5.push();
    p5.fill(c);
    p5.strokeWeight(1);
    p5.stroke(c);
    p5.textFont("monospace");
    p5.textSize(16);
    p5.text(p5.frameCount, 5, 20);
    p5.text((p5.millis() / 1000).toFixed(3), 5, 34);
    p5.pop();

    if (p5.mouseIsPressed) console.log("mouse press at frame", p5.frameCount);
    if (p5.keyIsPressed) console.log("key press at frame", p5.frameCount);
};
