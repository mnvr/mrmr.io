/** This sketch is inspired by the cover of a notebook I once had. */
export const sketch = (canvas: HTMLCanvasElement) => {
  const tick = () => requestAnimationFrame(draw);

  // Limit to 2, otherwise it has a potential to be too big and slow.
  const dpr = () => Math.floor(Math.max(devicePixelRatio, 2));

  const ctx = canvas.getContext("2d")!;

  const draw = () => {
    tick();

    const w = window.innerWidth * dpr();
    const h = window.innerHeight * dpr();

    if (canvas.width != w || canvas.height != h)
      (canvas.width = w), (canvas.height = h);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "tomato";
    ctx.fillRect(0, 0, w, h);

    const gap = 74;

    const fillDots = 235 + Math.sin(Date.now() / 4000) + 10;
    const strokeCircle = 232 + Math.cos(Date.now() / 3000) * 18;
    const strokeStar = 240 + Math.sin(Date.now() / 1400) * 16;

    // Offset the grid by a bit so that the initial row and column of dots is
    // not cut in half; just make things look a bit more pleasing to start with.
    ctx.resetTransform();
    ctx.translate(4, 4);

    const gridDots = () => {
      ctx.fillStyle = `rgb(${fillDots} ${fillDots} ${fillDots})`;

      // Draw beyond the edges so that we can still see the grid even after the
      // viewport has been rotated.
      for (let y = -(h + gap); y < 2 * h + gap; y += gap) {
        for (let x = -(w + gap); x < 2 * w + gap; x += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    };

    const gridCirclesAndStars = () => {
      ctx.lineWidth = 4;

      const offset = gap / 2;
      // This radius was computed for a gap of 50
      const d = (gap / 50) * 12;

      let c = 0;

      for (let y = -(h + gap + offset); y < 2 * h + offset; y += gap) {
        let lineCount = 0;
        for (let x = -(w + gap + offset); x < 2 * w + offset; x += gap) {
          // Alternate between the circle and the star
          if (c++ % 2) {
            ctx.strokeStyle = `rgb(${strokeCircle} ${strokeCircle} ${strokeCircle})`;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(x, y, d / 2, 0, 2 * Math.PI);
            ctx.stroke();
          } else {
            curvedStar(ctx, x, y, gap, gap, strokeStar);
          }
          lineCount++;
        }
        // If this line ended with an even number of items, increment the count
        // by 1 so that the next line starts with a piece that retains the
        // alignment.
        if (lineCount % 2 === 0) c++;
      }
    };

    gridDots();
    gridCirclesAndStars();
  };

  tick();
};

interface Pt {
  x: number;
  y: number;
}

/**
 * Draw a curved star centered at (x, y) with a bounding box sized w x h
 *
 * @param stroke Stroke color.
 */
const curvedStar = (
  ctx: CanvasRenderingContext2D,
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

  ctx.save();

  ctx.translate(x, y);
  ctx.scale(w / ow, h / oh);

  ctx.strokeStyle = `rgb(${stroke} ${stroke} ${stroke})`;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, 2 * Math.PI);
  ctx.fill();

  const segment = (a: Pt, b: Pt, c: Pt, d: Pt) => {
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(c.x, c.y, d.x, d.y, b.x, b.y);
    ctx.stroke();
  };

  const quarter = () => {
    const beg = { x: 0, y: -oh / 2 };
    const mid = { x: 45, y: -42 };
    const end = { x: ow / 2, y: 0 };

    segment(beg, mid, { x: 33, y: -116 }, { x: 18, y: -68 });
    segment(end, mid, { x: 116, y: -33 }, { x: 68, y: -18 });
  };

  for (let i = 0; i < 4; i++) {
    quarter();
    ctx.rotate(Math.PI / 2);
  }

  ctx.restore();
};
