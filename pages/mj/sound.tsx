export const beep = (
    ctx: AudioContext,
    duration: number,
    attack = 0.001,
    release = 0.1,
) => {
    const osc = new OscillatorNode(ctx);
    const env = new GainNode(ctx);
    const t = ctx.currentTime;

    // See: [Note: linearRampToValueAtTime alternative]
    env.gain.setValueCurveAtTime([0, 1], t, attack);
    env.gain.setTargetAtTime(0, t + attack + duration, release / 5);

    const mix = new GainNode(ctx, { gain: 0.1 });

    osc.connect(env).connect(mix).connect(ctx.destination);
    osc.start();
    osc.stop(t + attack + duration + release);
};
