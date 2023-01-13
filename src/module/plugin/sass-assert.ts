import chroma, { InterpolationMode } from 'chroma-js'
import { LegacyValue, types as Sass } from 'sass'

// Hack because the sass types package appears to be incorrect.
declare type SassLegacyValue<T extends LegacyValue> = T & {
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
export function assertColor(obj: SassLegacyValue<Sass.Color>) {
  if (!(obj instanceof Sass.Color)) {
    throw new Sass.Error(`Expected SASS Color, received: ${obj}`)
  }
}
export function assertNumber(obj: SassLegacyValue<Sass.Number>) {
  if (!(obj instanceof Sass.Number)) {
    throw new Sass.Error(`Expected SASS Number, received: ${obj}`)
  }
}
export function assertList(obj: SassLegacyValue<Sass.List>) {
  if (!(obj instanceof Sass.List)) {
    throw new Sass.Error(`Expected SASS List, received: ${obj}`)
  }
}
export function assertString(obj: SassLegacyValue<Sass.String>) {
  if (!(obj instanceof Sass.String)) {
    throw new Sass.Error(`Expected SASS String, received: ${obj}`)
  }
}
export function assertMode(obj: SassLegacyValue<Sass.String>) {
  assertString(obj)
  if (!COLOR_MODES.includes(obj?.getValue() as InterpolationMode)) {
    throw new Sass.Error(
      `Expected a chroma.js color interpolation mode, received: ${obj}`
    )
  }
}
export function assertModeChannel(obj: SassLegacyValue<Sass.String>) {
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
