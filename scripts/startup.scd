// Startup file for SuperCollider
//
// - Configures SuperCollider for running SuperDirt,
// - Boots SuperDirt whenever SuperCollider boots,
// - Boots SuperCollider, and
// - Configures SuperDirt.
//
// Installation
//
// Place this into Platform.userAppSupportDir as "startup.scd". Alternatively,
// open "startup.scd" (File > Open startup file) and just add the following:
//
//    "/path/to/this/file.scd".load;
//
// If done this way, we won't need to bother keeping both the copies in sync.

(
s.reboot {
	// Disable input
	//
	// Comment this out if we need input. Disabling it currently since we don't
	// need it right now, and on macOS it causes the OS to show the orange
	// recording indicator if SuperCollider opens the microphone input stream.
	s.options.inputStreamsEnabled_("00");

	// Increased this because we were getting "alloc failed" messages
	// > alloc failed, increase server's RT memory
	//
	// Default is 8192
	s.options.memSize = 8192 * 32;

	// Increased this because we were getting the message
	// > exceeded number of interconnect buffers
	//
	// Default is 64
	s.options.numWireBufs = 64 * 4;

	// Increased because not all the samples were loading.
	//
	// Specifically, in the Post window I could see that "217 existing
	// sample banks" were loaded from Dirt-Samples, but some of them had a
	// zero next to them. e.g. "sn (0)", which should've been "sn (52)"
	//
	// Further, when trying to play something like "bd sn", the bd played
	// fine but for the other one we got the "no synth or sample named
	// 'sn' could be found" message.
	//
	// Default value is 1024
	s.options.numBuffers = 1024 * 16;

	// Increase this if you start seeing "late 0.xxx" messages
	//
	// The latency defines how far ahead in the future sclang asks scsynth to
	// schedule the events that it sends (precisely, it is used as the time
	// delta in the bundles that sclang sends to scsynth, e.g. when using
	// `s.bind`). Since bundles deltas are from the logical time, this ensures
	// events are always in sync (as long as the OSC bundle reaches scsynth and
	// gets rendered before the delta has elapsed).
	//
	// The late messages appear if this delta has elapsed, and scsynth gets a
	// bundle with a time tag in the past.
	//
	// Default value is 0.2.
	//
	// Increasing latency will reduce the chances of it happening, but it is a
	// tradeoff, since increased latency also delays the responsiveness of
	// scsynth to the commands that we issue to it from sclang.
	//
	// Note that this is not automatically applied to all OSC messages! Pbind
	// for example uses this value when sending OSC bundles, but say raw
	// Synth(...) evaluations do not. Generally, sequencing routines should use
	// a bundle latency (this or otherwise), but synths triggered by live input
	// should be sent immediately.
	//
	// s.latency = 0.3

	// Free any old instances of SuperDirt to avoid duplicates.
	// This won't do anything if `~dirt` is nil.
	~dirt.free;

	// Boot the server and start SuperDirt
	s.waitForBoot {
		~dirt = SuperDirt();
		// Lazy load the samples
		// https://tidalcycles.org/docs/configuration/AudioSamples/lazy_loading
		~dirt.doNotReadYet = true;
		~dirt.loadSoundFiles();
		// Start SuperDirt with 4 orbits, all writing to the outBus 0.
		// (By default, it'll only create one orbit).
		~dirt.start(outBusses: 0 ! 4);
	}
}
)
