(
/**
 A simple sin wave, with an ASR envelope.

 Custom SuperDirt Synths
 -----------------------

 We can specify a name for our custom synth in Tidal with the "sound"
 (abbreviated "s") parameter. Then, we can write our Synth's definition in
 sclang. Since they're meant to be triggered by Tidal, they need to follow the
 argument names and output structure expected by SuperDirt.

 Parameters understood (and provided) by SuperDirt:
 - out: The output bus to use (default: 0, the audio output).
 - freq: Frequency of the sine wave, in Hertz.
 - sustain: The overall envelope duration in seconds.
 - pan: Pan position (-1 left, +1 right).
 - Some other SuperDirt provided-parameters not yet documented: |speed=1,
   begin=0, end=1, accelerate=0, offset|

 SuperDirt manages the envelope of the synth, which is why the definition of our
 SuperDirt-compatible synth is different from how one would go about writing a
 more conventional/vanilla SC synth.

 For more information about writing custom SuperDirt synths, see
 - https://tidalcycles.org/docs/configuration/adding_synthesizers
 - https://club.tidalcycles.org/t/week-5-lesson-3-adding-and-using-superdirt-synths/


 Envelopes
 ---------

 **TL;DR;** Feel free to use the the built-in "decay" parameter in Tidal. If
 further customization of the attack and release is needed, add custom
 parameters to the Synth, but don't call them "attack" and "release".

 SuperDirt manages the envelope of sounds / notes produced by the custom synth
 UGens that it triggers.

 - The synths themselves get passed a `sustain` argument. This is the duration
   (in seconds) of the entire note, not just the sustain part. The reference
   guide mentions this:

   > "In all synths, _sustain_ (default 1) affects the overall envelope
   > timescale"

   Note that there is also a "sustain" Tidal parameter, which sets the absolute
   duration of the note, and this can be longer than the duration computed by
   Tidal based on the input pattern. If the "sustain" is shorter, the note ends
   sooner (at least audibly), and if it longer, the note continues playing
   beyond its alloted timeslice.

   A good thing to keep in mind here is that SuperDirt was meant for playing
   back audio samples as the primitive operation; that's why we need to fidget
   around a bit to get the correct setup when applying its structure to synths.

 - Since SuperDirt knows the duration of the note and applies the gate, it can
   also manage the lifetime of the synth. And it does; it'll automatically free
   the synth once it is done playing. This means that we don't necessarily need
   to add a doneAction in the definition of the UGen, although if it is not a
   bad idea to add one nevertheless so that the synth cleans up after itself
   when playing it directly in SuperCollider.

 - To avoid clicks, SuperDirt applies a 1 ms fade in and fade out to all notes.
   This exact value is controlled by the fadeInTime and fadeTime arguments to
   the underlying "dirt_gate"

 - That's then the envelope applied by, a linear one.

       [fadeInTime, sustain - (fadeInTime + fadeOutTime), fadeOut]

 - SuperDirt has an effect called "envelope". This controls an ASR envelope,
   that can be parameterized on the Tidal side with the "attack", "hold" and
   "release" controls. If either of "attack" or "release" are specified, then
   SuperDirt will insert this ASR envelope between the synth and the gate (Our
   synth => dirt_envelope => dirt_gate).

 - Whilst this should be all we need in theory, in practice I've found that
   using these Tidal envelope controls produces clicks.

 - The pattern that seems to be followed in the other default SuperDirt synths
   is to define a Env internally, setting its timeScale to the provided sustain,
   and then incorporate any envelopes in this Env. Usually a "decay" is
   specified (Tidal also has a parameter to set this value).

 - We can also add our own custom parameters for other parts of the envelope,
   say the attack or the release. However, to ensure that the SuperDirt
   "envelope" does not get invoked, we'll need to call these something other
   than "attack" or "release". Remember that there is already a 1 ms attack
   implicitly applied by SuperDirt as the fadeInTime.

 - The curious ones amongst you who've also gone spelunking into the SuperDirt
   source might wonder about the Env.asr that is applied by the (global)
   dirt_monitor effect; whether it adds an attack of its own. Well, no. Because
   the gate for that EnvGen gets triggered only once, but it doesn't go back
   down to 0. As in, it is a global singleton-ish envelope, not a per note /
   sample envelope, and practically (say except for the first note maybe)
   doesn't come into the picture.
 */
SynthDef(\sin, { |out, freq=440, sustain=1, pan=0|
	// var env = Line.ar(1, 0, sustain, doneAction: Done.freeSelf);
	var env = EnvGen.ar(
		Env.linen(sustainTime: sustain),
		doneAction: Done.freeSelf);
	var osc = SinOsc.ar(freq);
	OffsetOut.ar(out, DirtPan.ar(osc, ~dirt.numChannels, pan, env));
}).add;
)
