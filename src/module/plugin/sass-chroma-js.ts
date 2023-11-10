// based on https://github.com/bugsnag/chromatic-sass

import Chroma from 'chroma-js'
import { last, maxBy, minBy } from 'lodash-es'

import type { LegacySyncFunction as SassSyncFunction } from 'sass'
import * as Sass from 'sass'
import type { SassLegacyValue } from './sass-assert'
import {
	assertColor,
	assertModeChannel as assertColorModeChannel,
	assertNumber,
	assertString,
	assertMode as assertColorMode,
	assertList
} from './sass-assert'
import {
	sass2Chroma,
	chroma2Sass,
	sassList2Array,
	map2SassMap,
	array2SassList
} from './sass-convert'
import { gamutize } from './gamutize'

/**
 * A SASS plugin that partially implements the `chroma.js` color manipulation library.
 * @see {@link Chroma}
 */
const plugin: Record<string, SassSyncFunction> = {
	/**
	 * @see {@link Chroma.Color.set}
	 */
	// @ts-expect-error
	'setChannel($color, $modechan, $value)': (
		color: SassLegacyValue<Sass.types.Color>,
		modechan: SassLegacyValue<Sass.types.String>,
		value: SassLegacyValue<Sass.types.Number>
	) => {
		assertColor(color)
		assertColorModeChannel(modechan)
		assertNumber(value)
		const newColor = sass2Chroma(color).set(
			modechan.getValue(),
			value.getValue()
		)
		return chroma2Sass(newColor)
	},
	/**
	 * @see {@link Chroma.Color.get}
	 */

	// @ts-expect-error
	'getChannel($color, $modechan)': (
		color: SassLegacyValue<Sass.types.Color>,
		modechan: SassLegacyValue<Sass.types.String>
	) => {
		assertColor(color)
		assertColorModeChannel(modechan)
		const chromaColor = sass2Chroma(color)
		return new Sass.types.Number(chromaColor.get(modechan.getValue()))
	},
	/**
	 * @see {@link Chroma.Color.luminance}
	 */

	// @ts-expect-error
	"luminance($color, $luminance: null, $color-space: 'rgb')": (
		color: SassLegacyValue<Sass.types.Color>,
		/**
		 * @default null
		 * @min 0
		 * @max 1
		 */
		luminance:
			| SassLegacyValue<Sass.types.Number>
			| SassLegacyValue<Sass.types.Null>,
		/**
		 * @default 'rgb'
		 */
		mode: SassLegacyValue<Sass.types.String>
	) => {
		assertColor(color)
		assertColorMode(mode)

		const chromaColor = sass2Chroma(color)

		if (!luminance || luminance instanceof Sass.types.Null) {
			// return the colour's luminance
			const luminance = chromaColor.luminance()

			return new Sass.types.Number(luminance)
		} else {
			assertNumber(luminance)
			// set the colour's luminance and return the new color

			return new Sass.types.Color(
				...chromaColor.luminance(
					luminance.getValue(),
					mode?.getValue() as Chroma.InterpolationMode
				)._rgb._unclipped
			)
		}
	},

	// @ts-expect-error
	'lightest($colors...)': (colors: SassLegacyValue<Sass.types.List>) => {
		assertList(colors)
		const arr = sassList2Array<Chroma.Color, SassLegacyValue<Sass.types.Color>>(
			colors,
			(v) => {
				assertColor(v)
				return sass2Chroma(v)
			}
		)
		return maxBy(arr, (color) => color.luminance())
	},

	// @ts-expect-error
	'darkest($colors...)': (colors: SassLegacyValue<Sass.types.List>) => {
		assertList(colors)
		const arr = sassList2Array<Chroma.Color, SassLegacyValue<Sass.types.Color>>(
			colors,
			(v) => {
				assertColor(v)
				return sass2Chroma(v)
			}
		)
		return minBy(arr, (color) => color.luminance())
	},
	/**
	 * @see {@link Chroma.contrast}
	 */

	// @ts-expect-error
	'contrast($color1, $color2)': (
		color1: SassLegacyValue<Sass.types.Color>,
		color2: SassLegacyValue<Sass.types.Color>
	) => {
		const [chromaColor1, chromaColor2] = [color1, color2].map((c) => {
			assertColor(c)
			return sass2Chroma(c)
		})
		const contrastValue = Chroma.contrast(chromaColor1, chromaColor2)
		return new Sass.types.Number(contrastValue)
	},

	// @ts-expect-error
	"mix($color1, $color2, $f: 0.5, $color-space: 'lrgb')": (
		color1: SassLegacyValue<Sass.types.Color>,
		color2: SassLegacyValue<Sass.types.Color>,
		f: SassLegacyValue<Sass.types.Number>,
		colorSpace: SassLegacyValue<Sass.types.String>
	) => {
		assertNumber(f)
		assertColorMode(colorSpace)
		const [chromaColor1, chromaColor2] = [color1, color2].map((c) => {
			assertColor(c)
			return sass2Chroma(c)
		})
		const newColor = Chroma.mix(
			chromaColor1,
			chromaColor2,
			f?.getValue(),
			colorSpace?.getValue() as Chroma.InterpolationMode
		)
		return chroma2Sass(newColor)
	},

	/**
	 * @see {@link Chroma.Color.hcl}
	 */

	// @ts-expect-error
	'hcl($h, $c, $l)': (
		h: SassLegacyValue<Sass.types.Number>,
		c: SassLegacyValue<Sass.types.Number>,
		l: SassLegacyValue<Sass.types.Number>
	) => {
		;[h, c, l].forEach((channel) => {
			assertNumber(channel)
		})
		const chromaColor = Chroma(
			[h.getValue(), c.getValue(), l.getValue()],
			'hcl'
		)
		return chroma2Sass(chromaColor)
	},
	/**
	 * @see {@link Chroma.Color.lch}
	 */
	// @ts-expect-error
	'lch($l,$c,$h)': (
		l: SassLegacyValue<Sass.types.Number>,
		c: SassLegacyValue<Sass.types.Number>,
		h: SassLegacyValue<Sass.types.Number>
	) => {
		;[l, c, h].forEach((channel) => {
			assertNumber(channel)
		})
		const chromaColor = Chroma(
			[l.getValue(), c.getValue(), h.getValue()],
			'lch'
		)
		return chroma2Sass(chromaColor)
	},

	/**
	 * @see {@link Chroma.Color.oklch}
	 */
	// @ts-expect-error
	'oklch($l,$c,$h)': (
		l: SassLegacyValue<Sass.types.Number>,
		c: SassLegacyValue<Sass.types.Number>,
		h: SassLegacyValue<Sass.types.Number>
	) => {
		;[l, c, h].forEach((channel) => {
			assertNumber(channel)
		})

		const chromaColor = Chroma(
			l.getValue(),
			c.getValue(),
			h.getValue(),
			'oklch'
		)
		return chroma2Sass(chromaColor)
	},

	// @ts-expect-error
	"scaleSteps($colors, $steps, $mode: 'lrgb')": (
		colors: SassLegacyValue<Sass.types.List>,
		steps: SassLegacyValue<Sass.types.Number>,
		mode: SassLegacyValue<Sass.types.String>
	) => {
		assertList(colors)
		assertNumber(steps)
		assertColorMode(mode)

		const chromaColors = sassList2Array<
			Chroma.Color,
			SassLegacyValue<Sass.types.Color>
		>(colors, (v) => sass2Chroma(v))
		const scale = Chroma.scale(chromaColors)
			.correctLightness(true)
			.classes(steps.getValue())
			.mode(mode.getValue() as Chroma.InterpolationMode)
			.colors(steps.getValue(), null)

		return array2SassList<Chroma.Color, Sass.types.Color>(scale, (v) =>
			chroma2Sass(v as any)
		)
	},
	/**
	 * Interpolates a palette of colors from four 'anchor' colors.
	 *
	 * Currently it doesn't check contrast, but it probably should.
	 *
	 * @param fgColor - The foreground color.
	 * @param bgColor - The background color.
	 * @param warmColor - A saturated accent/highlight color, used both as-is and in mixtures with the other colours.
	 * @param coolColor - A second saturated accent/highlight color, used both as-is and in mixtures with the other colours.
	 * @param prefix - the prefix to use for the generated CSS variables.
	 * @returns A {@link SassLegacyValue<sass.types.Map>} of keyed colours. Iterate over it with `@each` to set CSS bariables.
	 *
	 * @remarks 'warm' and 'cool' are used here primarily because they're more memorable labels than 'primary' or 'secondary'. They *could* be 'warmer'/'cooler' colours, but they don't have to be; 'warm'/'cool' are more about a UX element's importance/activity (warmer = more active/dramatic).
	 */
	// @ts-expect-error
	"gamutize($fg-color, $bg-color, $warm-color, $cool-color, $prefix: 'palette')":
		(
			fgColor: SassLegacyValue<Sass.types.Color>,
			bgColor: SassLegacyValue<Sass.types.Color>,
			warmColor: SassLegacyValue<Sass.types.Color>,
			coolColor: SassLegacyValue<Sass.types.Color>,
			/**
			 * @default 'palette'
			 */
			prefix: SassLegacyValue<Sass.types.String>
		) => {
			// typecheck the parameters SASS passed us
			;[fgColor, bgColor, warmColor, coolColor].forEach((c) => {
				assertColor(c)
			})
			assertString(prefix)

			// establish the how the dark and light colours will be mapped to the foreground and background colours
			const ground = {
				fg: sass2Chroma(fgColor),
				bg: sass2Chroma(bgColor)
			}
			const lightness = {
				light: maxBy([ground.fg, ground.bg], (color) =>
					color?.luminance()
				) as Chroma.Color,
				dark: minBy([ground.fg, ground.bg], (color) =>
					color?.luminance()
				) as Chroma.Color
			}
			const isDarkTheme = ground.fg.luminance() > ground.bg.luminance()

			const darkGround = isDarkTheme ? 'bg' : 'fg'
			const lightGround = isDarkTheme ? 'fg' : 'bg'

			const temperature = {
				warm: sass2Chroma(warmColor),
				cool: sass2Chroma(coolColor)
			}

			// setup complete! now generate the colour map
			const colors = gamutize(
				lightness.light,
				lightness.dark,
				temperature.warm,
				temperature.cool
			)

			// assign the map's light and dark colours to foreground and background
			colors.forEach((colorValue, colorKey) => {
				switch (true) {
					case colorKey.includes('light'):
						colors.set(colorKey.replace('light', lightGround), colorValue)
						break
					case colorKey.includes('dark'):
						colors.set(colorKey.replace('dark', darkGround), colorValue)
						break

					case colorKey.includes('scale') && isDarkTheme:
						colors.set(colorKey.replace('scale', 'midtone'), colorValue)
						break
					case colorKey.includes('scale'):
						{
							const oldScaleValueSubstring = last(colorKey.split('-'))
							if (!oldScaleValueSubstring)
								throw new Sass.types.Error(
									`Could not parse the last substring of ${colorKey}`
								)
							const oldScaleValue = parseInt(oldScaleValueSubstring)
							if (isNaN(oldScaleValue))
								throw new Sass.types.Error(
									`Could not parse a number from the last substring of ${colorKey}`
								)
							const newMidtoneValue = 100 - oldScaleValue
							colors.set(`midtone-${newMidtoneValue}`, colorValue)
						}
						break
					default:
						break
				}
			})

			const sassColors = map2SassMap(colors, (colorKey, colorValue) => ({
				key: new Sass.types.String(`${prefix.getValue()}-${colorKey}`),
				value: chroma2Sass(colorValue)
			}))

			return sassColors
		}
}

export default plugin
