import p5Types from "p5";


export const draw = (p5: p5Types) => {
    // Using clear instead background here because clear clears out the canvas
    // to a transparent background. This way, we do not need to specify the
    // background color as a p5.Color, and can use a more vibrant color
    // specified e.g. using OKLCH.
    p5.clear();

    p5.stroke(255);
    {
        const gap = 20;
        for (let i = 0; i < (p5.width / gap) * 2; i += 1) {
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
    }

    {
        const gap = 22 + Math.sin(p5.frameCount / 70) / 2;
        for (let i = 0; i < p5.width / gap; i += 1) {
            p5.stroke(
                Math.random() > 0.3
                    ? Math.floor(Math.sin(p5.frameCount / 70) * 5 + 250)
                    : 255
            );
            p5.line(2 + i * gap, 0, 2 + i * gap, p5.height);
        }
    }
};
