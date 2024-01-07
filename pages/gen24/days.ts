export interface Day {
    /** The day of the month this entry is for. */
    day: number;
    /** The prompt for that day. */
    prompt: string;
    /**
     * The color to show for the day's card.
     *
     * This'll be a string that CSS can understand.
     */
    color: string;
}

export const days: Day[] = [
    { day: 1, prompt: "Particles", color: "tomato" },
    { day: 2, prompt: "No palettes", color: "rgb(70, 194, 161)" },
    { day: 4, prompt: "Pixels", color: "limegreen" },
    { day: 8, prompt: "Chaotic system", color: "silver" },
];
