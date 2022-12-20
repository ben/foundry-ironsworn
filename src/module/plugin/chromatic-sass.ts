// based on https://github.com/bugsnag/chromatic-sass

import chroma, { contrast } from 'chroma-js'
import { isUndefined } from 'lodash'
import {
  CustomFunction,
  SassColor,
  SassList,
  SassNumber,
  SassString,
  Value,
} from 'sass'

const COLOR_MODES: chroma.InterpolationMode[] = [
  'rgb',
  'hsl',
  'hsv',
  'hsi',
  'lab',
  'lch',
  'hcl',
  'lrgb',
]

function assertColorMode(mode: Value) {
  mode.assertString()
  if (COLOR_MODES.includes(mode.toString() as any)) {
    return true
  }
  // TODO: more verbose error
  throw Error()
}

function assertModeChannel(modeChannel: Value) {
  modeChannel.assertString()
  const [mode, channel] = modeChannel.toString().split('.') as [
    chroma.InterpolationMode,
    string
  ]
  if (COLOR_MODES.includes(mode.toString() as any) && mode.includes(channel)) {
    return true
  }
  // TODO: more verbose error
  throw Error()
}

/**
 * Converts a {@link chroma.Color} to a {@link SassColor}.
 */
function chroma2Sass(color: chroma.Color) {
  const [red, green, blue, alpha] = color.rgba()
  return new SassColor({ red, green, blue, alpha })
}

/**
 * Converts a {@link SassColor} to a  {@link chroma.Color}.
 */
function sass2Chroma(color: SassColor) {
  color.assertColor()
  const { red, green, blue, alpha } = color
  return chroma.rgb(red, green, blue).alpha(alpha)
}

const sassFns: Record<string, CustomFunction<'sync'>> = {
  /**
   * @see {@link chroma.Color.set}
   */
  'set($color, $modechan, $v)': (
    color: SassColor,
    modechan: SassString,
    v: SassNumber
  ) => {
    color.assertColor()
    assertModeChannel(modechan)
    v.assertNumber()
    const newColor = sass2Chroma(color).set(modechan.toString(), v.value)
    return chroma2Sass(newColor)
  },
  /**
   * @see {@link chroma.Color.get}
   */
  'get($color, $modechan)': (color: SassColor, modechan: SassString) => {
    color.assertColor()
    assertModeChannel(modechan)
    const chromaColor = sass2Chroma(color)
    return new SassNumber(chromaColor.get(modechan.toString()))
  },
  /**
   * @see {@link chroma.Color.luminance}
   */
  "luminance($color, $luminance: '', $color-space: 'rgb')": (
    color: SassColor,
    /**
     * @default undefined
     * @min 0
     * @max 1
     */
    luminance?: SassNumber,
    /**
     * @default 'rgb'
     */
    mode?: SassString
  ) => {
    color.assertColor()
    luminance?.assertNumber()
    if (mode) {
      assertColorMode(mode)
    }
    const chromaColor = sass2Chroma(color)
    if (!isUndefined(luminance)) {
      const newColor = chromaColor.luminance(
        luminance.value,
        mode?.toString() as chroma.InterpolationMode
      )
      const [red, green, blue] = newColor.rgb()
      return new SassColor({ red, green, blue })
    } else return new SassNumber(chromaColor.luminance())
  },
  /**
   * @see {@link chroma.Color.contrast}
   */
  'contrast($color1, $color2)': (color1: SassColor, color2: SassColor) => {
    color1.assertColor()
    color2.assertColor()
    const [chromaColor1, chromaColor2] = [color1, color2].map((color) =>
      sass2Chroma(color)
    )
    const contrastValue = contrast(chromaColor1, chromaColor2)
    return new SassNumber(contrastValue)
  },
  'mix($color1, $color2, $f: 0.5, $color-space: lrgb)': (
    color1: SassColor,
    color2: SassColor,
    f?: SassNumber,
    colorSpace?: SassString
  ) => {
    ;[color1, color2].forEach((c) => c.assertColor())
    f?.assertNumber()
    colorSpace?.assertString()
    const [chromaColor1, chromaColor2] = [color1, color2].map((c) =>
      sass2Chroma(c)
    )
    const newColor = chroma.mix(
      chromaColor1,
      chromaColor2,
      f?.value,
      colorSpace?.toString() as chroma.InterpolationMode
    )
    return chroma2Sass(newColor)
  },

  /**
   * @see {@link chroma.Color.hcl}
   */
  'hcl($h, $c, $l)': (h: SassNumber, c: SassNumber, l: SassNumber) => {
    ;[h, c, l].forEach((item) => item.assertNumber())
    const chromaColor = chroma([h.value, c.value, l.value], 'hcl')
    return chroma2Sass(chromaColor)
  },

  'scale-steps($colors, $steps, $modechan: rgb)': (
    colors: SassList,
    steps: SassNumber,
    modechan: SassString
  ) => {
    steps.assertInt()
    assertModeChannel(modechan)
    const chromaColors: chroma.Color[] = []
    for (const color in colors) {
      chromaColors.push(chroma(color))
    }
    const scale = chroma
      .scale(chromaColors)
      .correctLightness(true)
      .out('hsl')
      .classes(steps.value)
      .mode(modechan.toString() as chroma.InterpolationMode)

    return new SassList(
      scale.colors(steps.value).map((c) => chroma2Sass(chroma(c))),

      {
        separator: ',',
      }
    )
  },
}

export default sassFns

/* Print JS stack traces for exceptions caught by sass:
 * Add to node_modules/sass/sass.dart.js: completeError$2(): console.error ('STACKTRACE:', st);
 * Text snipet:
   "use strict";
   const sass = require ('sass');
   const r = sass.renderSync ({
   file: 'ebeast/app.scss',
   includePaths: [ 'ebeast/', 'out/ebeast/', ],
   functions: require ("./chromatic-sass2"),
   });
   console.log (r.css.toString ('utf8'));
 */
