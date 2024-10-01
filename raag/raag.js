import { Synth } from "./synth.ts";

const synth = new Synth();

// The browser will let us autoplay on hover after the first click
// interaction on the page.
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
  const env = parent?.classList.contains("piano") ? { release: 3 } : undefined;
  button.setAttribute("data-playing", true);
  synth.play({ note: base + offset, env }, () => {
    button.removeAttribute("data-playing");
  });
};

const notes = document.querySelectorAll("button[data-offset]");
for (const note of notes) {
  note.ariaLabel = note.getAttribute("data-offset");
  note.addEventListener("click", (e) => play(e.target));
  note.addEventListener("pointerenter", (e) => {
    if (canAutoPlay) play(e.target);
  });
}
