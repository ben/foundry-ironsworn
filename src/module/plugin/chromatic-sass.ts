// based on https://github.com/bugsnag/chromatic-sass

import chroma, { contrast, mix } from 'chroma-js'
import { forEach, mapKeys, maxBy, mean, minBy, range } from 'lodash'

import {
  types as Sass,
  LegacyValue as SassValue,
  LegacySyncFunction as SassSyncFunction,
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

const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === 'function'
  )
}

function sassList2Array<T extends SassValue = SassValue>(list: Sass.List) {
  const array: T[] = []
  for (let i = 1; i < list.getLength(); i++) {
    array.push(list.getValue(i) as T)
  }
  return array
}

function array2SassList<T extends SassValue = SassValue>(array: T[]) {
  const list = new Sass.List(array.length, true)
  array.forEach((v, i) => list.setValue(i + 1, v))
  return list
}

function assertColorMode(mode: SassValue) {
  // mode.assertString()
  if (COLOR_MODES.includes(mode.toString() as any)) {
    return true
  }
  // TODO: more verbose error
  throw Error()
}

function assertModeChannel(modeChannel: SassValue) {
  // modeChannel.assertString()
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
 * Converts a {@link chroma.Color} to a {@link Sass.Color}.
 */
function chroma2Sass(color: chroma.Color) {
  const [red, green, blue, alpha] = color.rgba()
  const newColor = new Sass.Color(red, green, blue, alpha)
  return newColor
}

/**
 * Converts a {@link Sass.Color} to a  {@link chroma.Color}.
 */
function sass2Chroma(color: Sass.Color) {
  const colorString = `rgba(${[
    color.getR(),
    color.getG(),
    color.getB(),
    color.getA(),
  ].join(',')})`
  const newColor = chroma(colorString)

  // console.log('sass2Chroma converts', color, '\nto\n', newColor)
  return newColor
}

const chromaSass: Record<string, SassSyncFunction> = {
  /**
   * @see {@link chroma.Color.set}
   */
  'set($color, $modechan, $v)': (
    color: Sass.Color,
    modechan: Sass.String,
    v: Sass.Number
  ) => {
    // assertModeChannel(modechan)
    // v.assertNumber()
    const newColor = sass2Chroma(color).set(modechan.toString(), v.getValue())
    return chroma2Sass(newColor)
  },
  /**
   * @see {@link chroma.Color.get}
   */
  'get($color, $modechan)': (color: Sass.Color, modechan: Sass.String) => {
    // assertModeChannel(modechan)
    const chromaColor = sass2Chroma(color)
    return new Sass.Number(chromaColor.get(modechan.toString()))
  },
  /**
   * @see {@link chroma.Color.luminance}
   */
  "luminance($color, $luminance: '', $color-space: 'rgb')": (
    color: Sass.Color,
    /**
     * @default undefined
     * @min 0
     * @max 1
     */
    luminance: Sass.Number,
    /**
     * @default 'rgb'
     */
    mode?: Sass.String
  ) => {
    const chromaColor = sass2Chroma(color)

    if (luminance instanceof Sass.String) {
      // return the colour's luminance
      const luminance = chromaColor.luminance()

      return new Sass.Number(luminance)
    } else {
      // set the colour's luminance and return the new color
      chromaColor.luminance(
        luminance.getValue(),
        mode?.toString() as chroma.InterpolationMode
      )
      return new Sass.Color(...chromaColor._rgb._unclipped)
    }
  },
  'lightest($colors...)': (colors: Sass.List) => {
    const arr = sassList2Array<Sass.Color>(colors)
    return maxBy(arr, (color) => sass2Chroma(color).luminance())
  },
  'darkest($colors...)': (colors: Sass.List) => {
    const arr = sassList2Array<Sass.Color>(colors)
    return minBy(arr, (color) => sass2Chroma(color).luminance())
  },
  /**
   * @see {@link chroma.Color.contrast}
   */
  'contrast($color1, $color2)': (color1: Sass.Color, color2: Sass.Color) => {
    // color1.assertColor()
    // color2.assertColor()
    const [chromaColor1, chromaColor2] = [color1, color2].map((color) =>
      sass2Chroma(color)
    )
    const contrastValue = contrast(chromaColor1, chromaColor2)
    return new Sass.Number(contrastValue)
  },
  'mix($color1, $color2, $f: 0.5, $color-space: lrgb)': (
    color1: Sass.Color,
    color2: Sass.Color,
    f?: Sass.Number,
    colorSpace?: Sass.String
  ) => {
    // ;[color1, color2].forEach((c) => c.assertColor())
    // f?.assertNumber()
    // colorSpace?.assertString()
    const [chromaColor1, chromaColor2] = [color1, color2].map((c) =>
      sass2Chroma(c)
    )
    const newColor = chroma.mix(
      chromaColor1,
      chromaColor2,
      f?.getValue(),
      colorSpace?.toString() as chroma.InterpolationMode
    )
    return chroma2Sass(newColor)
  },

  /**
   * @see {@link chroma.Color.hcl}
   */
  'hcl($h, $c, $l)': (h: Sass.Number, c: Sass.Number, l: Sass.Number) => {
    // ;[h, c, l].forEach((item) => item.assertNumber())
    const chromaColor = chroma(
      [h.getValue(), c.getValue(), l.getValue()],
      'hcl'
    )
    return chroma2Sass(chromaColor)
  },

  'scale-steps($colors, $steps, $modechan: rgb)': (
    colors: Sass.List,
    steps: Sass.Number,
    modechan: Sass.String
  ) => {
    // steps.assertInt()
    // assertModeChannel(modechan)
    const chromaColors: chroma.Color[] = []
    for (const color in colors) {
      chromaColors.push(chroma(color))
    }
    const scale = chroma
      .scale(chromaColors)
      .correctLightness(true)
      .out('hsl')
      .classes(steps.getValue())
      .mode(modechan.toString() as chroma.InterpolationMode)

    return new Sass.List(
      scale.colors(steps.value).map((c) => chroma2Sass(chroma(c))),

      {
        separator: ',',
      }
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
   * @returns A {@link Sass.Map} of keyed colours. Iterate over it with `@each` to set CSS custom properties that can
   *
   * @remarks 'warm' and 'cool' are used here primarily because they're more memorable labels than 'primary' or 'secondary'. They *could* be 'warmer'/'cooler' colours, but they don't have to be; 'warm'/'cool' are more about a UX element's importance/activity (warmer = more active/dramatic).
   */
  'gamutize($fg-color, $bg-color, $warm-color, $cool-color, $prefix: palette)':
    (
      fgColor: Sass.Color,
      bgColor: Sass.Color,
      warmColor: Sass.Color,
      coolColor: Sass.Color,
      /**
       * @default 'palette'
       */
      prefix: Sass.String
    ) => {
      const ground = {
        fg: sass2Chroma(fgColor),
        bg: sass2Chroma(bgColor),
      }
      const steps = range(10, 100, 10)
      const cssPrefix = prefix.getValue()

      const lightness = {
        light: maxBy([ground.fg, ground.bg], (color) =>
          color?.luminance()
        ) as chroma.Color,
        dark: minBy([ground.fg, ground.bg], (color) =>
          color?.luminance()
        ) as chroma.Color,
      }
      const temperature = {
        warm: sass2Chroma(warmColor),
        cool: sass2Chroma(coolColor),
      }
      const colorMap = new Map<string, chroma.Color>()
      const mode: chroma.InterpolationMode = 'hcl'

      forEach(
        {
          ...lightness,
          ...ground,
          ...temperature,
        },
        (color, colorKey) => {
          colorMap.set(`${cssPrefix}-${colorKey}`, color)
          // mix overlays
          steps.forEach((step) => {
            const stepFactor = step / 100
            colorMap.set(
              `${cssPrefix}-${colorKey}-${step}`,
              color.alpha(stepFactor)
            )
          })
        }
      )
      steps.forEach((step) => {
        const stepFactor = step / 100
        // mix scales
        const scaleColor = chroma.mix(
          lightness['light'],
          lightness['dark'],
          stepFactor,
          mode
        )

        // Mix a colour scale from $light-color to $dark-color, where *-scale-90 is 90% $light-color, and *-scale-10 is 10% $light-color.
        colorMap.set(`${cssPrefix}-scale-${step}`, scaleColor)

        // Mix a color scale of midtones from $fg-color to $bg-color, where *-midtone-90 is 90% $fg-color, and *-midtone-10 is 10% $fg-color.
        colorMap.set(
          `${cssPrefix}-midtone-${step}`,
          mix(ground['fg'], ground['bg'], stepFactor, mode)
        )
      })

      // mix color variants
      forEach({ ...lightness, ...ground }, (vBase, kBase) => {
        forEach(temperature, (vTemp, kTemp) => {
          colorMap.set(
            `${cssPrefix}-${kBase}-${kTemp}`,
            mix(vBase, vTemp, 0.5, mode)
          )
        })
      })

      const sassColorMap = new Sass.Map(colorMap.size)
      let index = 0
      colorMap.forEach((colorValue, colorKey) => {
        sassColorMap.setKey(index, new Sass.String(colorKey))
        sassColorMap.setValue(index, chroma2Sass(colorValue))
        index++
      })

      return sassColorMap
    },
}

export default chromaSass
