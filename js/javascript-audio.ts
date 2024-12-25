let ac: AudioContext | undefined;

export const getAudioContext = () => {
  if (!ac) {
    ac = new AudioContext();
  }

  // [Note: Safari iOS "interrupted" AudioContext]
  //
  // Always resume the context
  //
  // Ideally, this would need to be done only once. However, on iOS Safari the
  // audio context switches to an "interrupted" state if we navigate away from
  // the page for an extended time. If we were to then come back and play, no
  // sound would be emitted until the context is resumed.
  //
  // I've empirically observed this. For more details, see
  // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state#resuming_interrupted_play_states_in_ios_safari
  //
  // Also, it seems that iOS will only allow the audioContext to be resumed if
  // it is running within the call-stack of the a UI event handler.
  //
  // Note that we don't suspend the audio context when we're done playing. An
  // earlier version of this code did indeed try to be a good citizen and
  // suspend the audio context when the note was done playing. However, doing
  // that caused stuttery audio. So we just let it be. The browser automatically
  // stops showing the "playing"/"speaker" icon next to our tab in the tab bar
  // even if we don't explicitly suspend it, so not suspending doesn't have any
  // functional impact that I can tell of.

  ac.resume();

  return ac;
};

export const suspend = () => ac?.suspend();

export const toggleFirstTone = (oscNode: OscillatorNode | undefined) => {
  if (oscNode) return oscNode.stop(), undefined;
  const ctx = getAudioContext();
  const osc = new OscillatorNode(ctx);
  const mix = new GainNode(ctx, { gain: 0.1 });
  osc.connect(mix).connect(ctx.destination);
  osc.start();
  return osc;
};

export const beep = (
  duration: number,
  attack = 0.001,
  release = 0.1,
  frequency = 440,
  gain = 0.1,
) => {
  const ctx = getAudioContext();
  const osc = new OscillatorNode(ctx, { frequency });
  const env = new GainNode(ctx);
  const t = ctx.currentTime;

  // See: [Note: linearRampToValueAtTime alternative]
  env.gain.setValueCurveAtTime([0, 1], t, attack);
  env.gain.setTargetAtTime(0, t + attack + duration, release / 5);

  const mix = new GainNode(ctx, { gain });

  osc.connect(env).connect(mix).connect(ctx.destination);
  osc.start();
  osc.stop(t + attack + duration + release);

  return osc;
};
