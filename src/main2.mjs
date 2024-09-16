import Q5 from "q5";
import "./main2.css";
import { sketch } from "./sketch.ts";

// window.onload = async () => {
//     const p5 = await import(
//         "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js"
//     );
//     console.log(p5);
//     console.debug(p5);
// };

console.log(Q5);

const q5 = new Q5();
sketch(q5);

// q5.setup = () => {
//     const width = Math.round(Math.min(400, window.innerWidth * 0.9));
//     const height = Math.round((width * 3) / 5);
//     q5.createCanvas(width, height);
//     console.log("setup");
// };
