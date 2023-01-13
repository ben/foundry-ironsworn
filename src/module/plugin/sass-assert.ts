import chroma, { InterpolationMode } from 'chroma-js'
import { LegacyValue, types as Sass } from 'sass'

declare type SassLegacyValue = LegacyValue & {
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
  'oklch',
]
// HELPER FUNCTIONS: TYPECHECK SASS VALUES
export function assertColor(obj: SassLegacyValue) {
  if (!(obj instanceof Sass.Color)) {
    throw new Sass.Error(`Expected SASS Color, received: ${obj?.dartValue}`)
  }
}
export function assertNumber(obj: SassLegacyValue) {
  if (!(obj instanceof Sass.Number)) {
    throw new Sass.Error(`Expected SASS Number, received: ${obj?.dartValue}`)
  }
}
export function assertList(obj: SassLegacyValue) {
  if (!(obj instanceof Sass.List)) {
    throw new Sass.Error(`Expected SASS List, received: ${obj?.dartValue}`)
  }
}
export function assertString(obj: SassLegacyValue) {
  if (!(obj instanceof Sass.String)) {
    throw new Sass.Error(`Expected SASS String, received: ${obj?.dartValue}`)
  }
}
export function assertMode(obj: SassLegacyValue) {
  assertString(obj)
  if (!COLOR_MODES.includes(obj?.getValue() as InterpolationMode)) {
    throw new Sass.Error(
      `Expected a chroma.js color interpolation mode, received: ${obj?.dartValue}`
    )
  }
}
export function assertModeChannel(obj: SassLegacyValue) {
  assertString(obj)
  const [mode, chan] = obj.getValue().split('.')

  if (
    // invalid color mode
    !COLOR_MODES.includes(mode as InterpolationMode) ||
    // invalid color channel for mode. 'a' (alpha channel) is always valid
    (chan !== 'a' && !mode.includes(chan))
  ) {
    throw new Sass.Error(
      `Expected a chroma.js color interpolation mode and channel, received: ${obj}`
    )
  }
}
