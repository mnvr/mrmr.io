/**
 * Return the value of 1 rem.
 *
 * 1 REM is the font size of the root element.
 *
 * Alternatives: There is also a `getComputedSize` method that will presumably
 * do the same calculations as what the browsers do, but apparently (from
 * reading about it, no direct experience) it does a reflow. For simple cases
 * where the value we're concerned with can be trivially calculated from 1rem,
 * we can use this method instead.
 */
export const rem = () =>
    parseInt(window.document.documentElement.style.fontSize);
