// For more information about writing custom SuperDirt synths, see
// - https://tidalcycles.org/docs/configuration/adding_synthesizers
// - https://club.tidalcycles.org/t/week-5-lesson-3-adding-and-using-superdirt-synths/1115

(
/**
 A simple sin wave, with an ASR envelope.

 This is meant to be triggered by Tidal, and thus follows the argument names and
 output structure expected by SuperDirt.

 Parameters understood (and provided) by Superdirt:
 - out: The output bus to use (default: 0, the audio output).
 - freq: Frequency of the sine wave, in Hertz.
 - sustain: The sustain duration in seconds.
 - pan: Pan position (-1 left, +1 right).

 Other SuperDirt provided-parameters that are not incorporated:
 - |speed=1, begin=0, end=1, accelerate, offset|

 SuperDirt manages the envelope of the synth, which is why the definition of our
 SuperDirt-compatible synth is different from how one would go about writing a
 more conventional/vanilla SC synth.
 */
SynthDef(\sin, { |out, sustain=1, freq=440, pan=0|
	// var env    = Line.ar(1, 0, sustain, doneAction: Done.freeSelf);
	var env = EnvGen.ar(
		Env.linen(sustainTime: sustain),
		doneAction: Done.freeSelf);
	var osc = SinOsc.ar(freq);
	OffsetOut.ar(out, DirtPan.ar(osc, ~dirt.numChannels, pan, env));
}).add;
)
