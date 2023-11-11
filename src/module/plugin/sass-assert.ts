import type { InterpolationMode } from 'chroma-js'
import type chroma from 'chroma-js'
import * as Sass from 'sass'

// Hack because the sass types package appears to be incorrect.
export type SassLegacyValue<T extends Sass.LegacyValue> = T & {
	dartValue: any
	getValue: () => any
}

const COLOR_MODES: chroma.InterpolationMode[] = [
	'rgb',
	'hsl',
	'hsv',
	'hsi',
	'lab',
	'lch',
	'hcl',
	'lrgb',
	'oklab',
	'oklch'
]
// HELPER FUNCTIONS: TYPECHECK SASS VALUES
export function assertColor(obj: SassLegacyValue<Sass.types.Color>) {
	if (!(obj instanceof Sass.types.Color)) {
		throw new Sass.types.Error(`Expected SASS Color, received: ${obj}`)
	}
}
export function assertNumber(obj: SassLegacyValue<Sass.types.Number>) {
	if (!(obj instanceof Sass.types.Number)) {
		throw new Sass.types.Error(`Expected SASS Number, received: ${obj}`)
	}
}
export function assertList(obj: SassLegacyValue<Sass.types.List>) {
	if (!(obj instanceof Sass.types.List)) {
		throw new Sass.types.Error(`Expected SASS List, received: ${obj}`)
	}
}
export function assertString(obj: SassLegacyValue<Sass.types.String>) {
	if (!(obj instanceof Sass.types.String)) {
		throw new Sass.types.Error(`Expected SASS String, received: ${obj}`)
	}
}
export function assertMode(obj: SassLegacyValue<Sass.types.String>) {
	assertString(obj)
	if (!COLOR_MODES.includes(obj?.getValue() as InterpolationMode)) {
		throw new Sass.types.Error(
			`Expected a chroma.js color interpolation mode, received: ${obj}`
		)
	}
}
export function assertModeChannel(obj: SassLegacyValue<Sass.types.String>) {
	assertString(obj)
	const [mode, chan] = obj.getValue().split('.')

	if (
		// invalid color mode
		!COLOR_MODES.includes(mode as InterpolationMode) ||
		// invalid color channel for mode. 'a' (alpha channel) is always valid
		(chan !== 'a' && !mode.includes(chan))
	) {
		throw new Sass.types.Error(
			`Expected a chroma.js color interpolation mode and channel, received: ${obj}`
		)
	}
}
