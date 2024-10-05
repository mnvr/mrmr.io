import { Synth } from "./synth.ts";

const synth = new Synth();

// The browser will let us autoplay on hover after the first click interaction
// on the page.
let canAutoPlay = false;

window.addEventListener("click", () => {
    synth.init(); /* if needed */
    canAutoPlay = true;
});

const play = (button) => {
    const offset = parseInt(button.getAttribute("data-offset"));
    const parent = button.parentElement;
    const base =
        parseInt(
            parent.getAttribute("data-offset-base") ||
                parent.parentElement.getAttribute("data-offset-base")
        ) || 69;
    const env = parent?.classList.contains("piano")
        ? { release: 3 }
        : undefined;
    button.setAttribute("data-playing", true);
    synth.play({ note: base + offset, env }, () => {
        button.removeAttribute("data-playing");
    });
};

const notes = document.querySelectorAll("button[data-offset]");
for (const note of notes) {
    note.ariaLabel = note.getAttribute("data-offset");
    // Always play when the button is activated.
    note.addEventListener("click", (e) => play(e.target));
    // Play on hover, but only on mouse hovers, because otherwise on touch
    // devices we end up with duplicate playback because of back to back
    // pointerenter and click events.
    note.addEventListener("pointerenter", (e) => {
        if (e.pointerType == "mouse" && canAutoPlay) play(e.target);
    });
    // Play when the user tabs through the buttons.
    note.addEventListener("focus", (e) => {
        if (canAutoPlay) play(e.target);
    });
}
