import Q5 from "q5";
import "./main2.css";
import { sketch } from "./sketch.ts";

const q5 = new Q5();
const parent = document.getElementById("root");
console.log(parent);
sketch(q5, parent);
setTimeout(() => parent.appendChild(q5.canvas), 0);
