import chroma from 'chroma-js'
import _ from 'lodash-es'
/**
 * Interpolates a palette of colors from four 'anchor' colors.
 *
 * Currently it doesn't check contrast, but it probably should.
 *
 * @param light - A light color.
 * @param dark - A dark color.
 * @param warm - A saturated accent/highlight color, used both as-is and in mixtures with the other colours.
 * @param cool - A second saturated accent/highlight color, used both as-is and in mixtures with the other colours.
 * @returns A {@link Map} of keyed colours.
 *
 * @remarks 'warm' and 'cool' are used here primarily because they're more memorable labels than 'primary' or 'secondary'. They *could* be 'warmer'/'cooler' colours, but they don't have to be; 'warm'/'cool' are more about a UX element's importance/activity (warmer = more active/dramatic).
 */
export function gamutize(
	light: chroma.Color,
	dark: chroma.Color,
	warm: chroma.Color,
	cool: chroma.Color
) {
	// steps to use when mixing scales
	const steps = _.range(10, 100, 10)
	const luminance = { light, dark }
	const temperature = { warm, cool }
	// initialize color container
	const colors = new Map<string, chroma.Color>()

	_.forEach(luminance, (lValue, lKey) => {
		colors.set(lKey, lValue)
		_.forEach(temperature, (tValue, tKey) => {
			if (!colors.has(tKey)) {
				colors.set(tKey, tValue)
			}
			// TODO: have this do something smarter. ideally, should have sufficient contrast from the original colour.
			const newColor = chroma.mix(lValue, tValue, 0.5, 'oklab')
			colors.set(`${lKey}-${tKey}`, newColor)
		})
	})

	// mix scale from dark to light
	const luminanceScale = chroma
		.scale([dark, light])
		.domain([0, 100])
		.mode('oklab')
	steps.forEach((step) => {
		colors.set(`scale-${step}`, luminanceScale(step))
	})
	// mix overlays
	_.forEach({ ...luminance, ...temperature }, (color, key) => {
		steps.forEach((step) => {
			const factor = step / 100
			colors.set(`${key}-${step}`, color.alpha(factor))
		})
	})

	return colors
}
