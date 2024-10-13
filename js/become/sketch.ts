/** This sketch is inspired by the cover of a notebook I once had. */
export const draw = (p5: any) => {
  p5.clear();
  p5.background("#ff7729"); /* saffron-ish */

  const gap = 50;

  const strokeDots = 235;
  const strokeStar = 240 + Math.sin(Date.now() / 2000) * 16;
  const strokeCircle = 237 + Math.cos(Date.now() / 5000) * 16;

  // Offset the grid by a bit so that the initial row and column of dots is
  // not cut in half; just make things look a bit more pleasing to start with.
  p5.translate(4, 4);

  gridDots(p5, { gap, stroke: strokeDots });
  gridCirclesAndStars(p5, { gap, strokeCircle, strokeStar });
};

interface DotsDrawOpts {
  gap: number;
  stroke: number;
}

const gridDots = (p5: any, o: DotsDrawOpts) => {
  const { stroke, gap } = o;

  p5.stroke(stroke);
  p5.strokeWeight(8);

  // Draw beyond the edges so that we can still see the grid even after the
  // viewport has been rotated.
  const [h, w] = [p5.height, p5.width];
  for (let y = -(h + gap); y < 2 * h + gap; y += gap) {
    for (let x = -(w + gap); x < 2 * w + gap; x += gap) {
      p5.point(x, y);
    }
  }
};

interface CirclesAndStarsDrawOpts {
  gap: number;
  strokeCircle: number;
  strokeStar: number;
}

const gridCirclesAndStars = (p5: any, o: CirclesAndStarsDrawOpts) => {
  const { gap, strokeCircle, strokeStar } = o;

  p5.strokeWeight(4);

  p5.noFill();

  p5.rectMode(p5.CENTER);
  p5.angleMode(p5.RADIANS);

  const offset = gap / 2;
  // This radius was computed for a gap of 50
  const d = (gap / 50) * 12;

  // Draw beyond the edges so that we can still see the grid even after the
  // viewport has been rotated.
  const [h, w] = [p5.height, p5.width];

  let c = 0;

  for (let y = -(h + gap + offset); y < 2 * h + offset; y += gap) {
    let lineCount = 0;
    for (let x = -(w + gap + offset); x < 2 * w + offset; x += gap) {
      // Alternate between the circle and the star
      if (c++ % 2) {
        p5.stroke(strokeCircle);
        p5.circle(x, y, d);
      } else {
        curvedStar(p5, x, y, gap, gap, strokeStar);
      }
      lineCount++;
    }
    // If this line ended with an even number of items, increment the count
    // by 1 so that the next line starts with a piece that retains the
    // alignment.
    if (lineCount % 2 === 0) c++;
  }
};

/**
 * Draw a curved star centered at (x, y) with a bounding box sized w x h
 *
 * @param stroke Stroke color.
 * @param showOutlines If true, then the outlines / scaffolding and control
 *        points used to draw the shape are shown. This is useful for debugging.
 */
const curvedStar = (
  p5: any,
  x: number,
  y: number,
  w: number,
  h: number,
  stroke: number,
) => {
  // The coordinates below were laid out for a 240 x 240 sized shape. We scale
  // them appropriately depending on the actual width and height passed to us.
  // Note that this will also scale the strokeWeight (which is mostly the
  // effect we want here).
  const [ow, oh] = [240, 240];

  p5.push();
  p5.translate(x, y);
  p5.scale(w / ow, h / oh);

  p5.noFill();

  p5.stroke(stroke);
  p5.strokeWeight(40);
  p5.point(0, 0);

  const segment = (a: any /*p5.Vector*/, b: any, c: any, d: any) => {
    p5.stroke(stroke);
    p5.strokeWeight(20);
    p5.bezier(a.x, a.y, c.x, c.y, d.x, d.y, b.x, b.y);
  };

  const quarter = () => {
    const beg = p5.createVector(0, -oh / 2);
    const mid = p5.createVector(45, -42);
    const end = p5.createVector(ow / 2, 0);

    segment(beg, mid, p5.createVector(33, -116), p5.createVector(18, -68));
    segment(end, mid, p5.createVector(116, -33), p5.createVector(68, -18));
  };

  for (let i = 0; i < 4; i++) {
    quarter();
    p5.rotate(p5.PI / 2);
  }

  p5.pop();
};
