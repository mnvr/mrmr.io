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
    /**
     * An optional string that overrides {@link color} when in dark mode.
     */
    darkColor?: string;
}

export const days: Day[] = [
    { day: 1, prompt: "Particles", color: "tomato" },
    { day: 2, prompt: "No palettes", color: "rgb(70, 194, 161)" },
    { day: 4, prompt: "Pixels", color: "limegreen" },
    { day: 8, prompt: "Chaotic system", color: "silver" },
    { day: 11, prompt: "Anni Albers", color: "rgb(215, 204, 180)" },
    {
        day: 18,
        prompt: "Bauhaus",
        color: "rgb(210, 200, 5)",
        darkColor: "rgb(200, 215, 20)",
    },
    { day: 25, prompt: "Recreate", color: "rgb(220, 60, 70)" },
];
