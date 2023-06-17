// common/primitives/math.mjs v11.301
declare module 'Math' {
	/**
	 * Bound a number between some minimum and maximum value, inclusively.
	 * @param num    The current value
	 * @param min    The minimum allowed value
	 * @param max    The maximum allowed value
	 * @return       The clamped number
	 */
	export function clamped(num: number, min: number, max: number): number

	/**
	 * Linear interpolation function
	 * @param a   An initial value when weight is 0.
	 * @param b   A terminal value when weight is 1.
	 * @param w   A weight between 0 and 1.
	 * @return    The interpolated value between a and b with weight w.
	 */
	export function mix(a: number, b: number, w): number

	/**
	 * Transform an angle in degrees to be bounded within the domain [0, 360]
	 * @param degrees - An angle in degrees
	 * @param base - The base angle to normalize to, either 0 for [0, 360) or 360 for (0, 360]
	 * @return The same angle on the range [0, 360) or (0, 360]
	 */
	export function normalizeDegrees(degrees: number, base?: number): number
	/**
	 * Transform an angle in radians to be bounded within the domain [-PI, PI]
	 * @param radians  An angle in degrees
	 * @return         The same angle on the range [-PI, PI]
	 */
	export function normalizeRadians(radians: number): number

	/**
	 * Round a floating point number to a certain number of decimal places
	 * @param number - A floating point number
	 * @param places - An integer number of decimal places
	 */
	export function roundDecimals(number: number, places: number): number

	/**
	 * Transform an angle in radians to a number in degrees
	 * @param angle - An angle in radians
	 * @return An angle in degrees
	 */
	export function toDegrees(angle: number): number

	/**
	 * Transform an angle in degrees to an angle in radians
	 * @param angle - An angle in degrees
	 * @return An angle in radians
	 */
	export function toRadians(angle: number): number

	/**
	 * Get an oscillation between lVal and hVal according to t
	 * @param minVal - The minimal value of the oscillation.
	 * @param maxVal - The maximum value of the oscillation.
	 * @param t - The time value.
	 * @param p - The period (can't be equal to 0). (default: `1`)
	 * @param func - The optional math function to use for oscillation. (default: `Math.cos`)
	 * @return The oscillation according to t.
	 */
	export function oscillation(
		minVal: number,
		maxVal: number,
		t: number,
		p: number,
		func?: (x: number) => number
	): number
}
