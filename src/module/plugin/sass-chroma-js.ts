// based on https://github.com/bugsnag/chromatic-sass

import chroma, { contrast } from 'chroma-js'
import { last, maxBy, minBy } from 'lodash'

import { types as Sass, LegacySyncFunction as SassSyncFunction } from 'sass'
import {
  assertColor,
  assertModeChannel as assertColorModeChannel,
  assertNumber,
  assertString,
  assertMode as assertColorMode,
  assertList,
  SassLegacyValue,
} from './sass-assert'
import {
  sass2Chroma,
  chroma2Sass,
  sassList2Array,
  map2SassMap,
  array2SassList,
} from './sass-convert'
import { gamutize } from './gamutize'

/**
 * A SASS plugin that partially implements the `chroma.js` color manipulation library.
 * @see {@link chroma}
 */
const plugin: Record<string, SassSyncFunction> = {
  /**
   * @see {@link chroma.Color.set}
   */
  // @ts-ignore
  'set-channel($color, $modechan, $value)': (
    color: SassLegacyValue<Sass.Color>,
    modechan: SassLegacyValue<Sass.String>,
    value: SassLegacyValue<Sass.Number>
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
   * @see {@link chroma.Color.get}
   */

  // @ts-ignore
  'get-channel($color, $modechan)': (
    color: SassLegacyValue<Sass.Color>,
    modechan: SassLegacyValue<Sass.String>
  ) => {
    assertColor(color)
    assertColorModeChannel(modechan)
    const chromaColor = sass2Chroma(color)
    return new Sass.Number(chromaColor.get(modechan.getValue()))
  },
  /**
   * @see {@link chroma.Color.luminance}
   */

  // @ts-ignore
  "luminance($color, $luminance: null, $color-space: 'rgb')": (
    color: SassLegacyValue<Sass.Color>,
    /**
     * @default null
     * @min 0
     * @max 1
     */
    luminance: SassLegacyValue<Sass.Number> | SassLegacyValue<Sass.Null>,
    /**
     * @default 'rgb'
     */
    mode: SassLegacyValue<Sass.String>
  ) => {
    assertColor(color)
    assertColorMode(mode)

    const chromaColor = sass2Chroma(color)

    if (!luminance || luminance instanceof Sass.Null) {
      // return the colour's luminance
      const luminance = chromaColor.luminance()

      return new Sass.Number(luminance)
    } else {
      assertNumber(luminance)
      // set the colour's luminance and return the new color

      return new Sass.Color(
        ...chromaColor.luminance(
          luminance.getValue(),
          mode?.getValue() as chroma.InterpolationMode
        )._rgb._unclipped
      )
    }
  },

  // @ts-ignore
  'lightest($colors...)': (colors: SassLegacyValue<Sass.List>) => {
    assertList(colors)
    const arr = sassList2Array<chroma.Color, SassLegacyValue<Sass.Color>>(
      colors,
      (v) => {
        assertColor(v)
        return sass2Chroma(v)
      }
    )
    return maxBy(arr, (color) => color.luminance())
  },

  // @ts-ignore
  'darkest($colors...)': (colors: SassLegacyValue<Sass.List>) => {
    assertList(colors)
    const arr = sassList2Array<chroma.Color, SassLegacyValue<Sass.Color>>(
      colors,
      (v) => {
        assertColor(v)
        return sass2Chroma(v)
      }
    )
    return minBy(arr, (color) => color.luminance())
  },
  /**
   * @see {@link chroma.Color.contrast}
   */

  // @ts-ignore
  'contrast($color1, $color2)': (
    color1: SassLegacyValue<Sass.Color>,
    color2: SassLegacyValue<Sass.Color>
  ) => {
    const [chromaColor1, chromaColor2] = [color1, color2].map((c) => {
      assertColor(c)
      return sass2Chroma(c)
    })
    const contrastValue = contrast(chromaColor1, chromaColor2)
    return new Sass.Number(contrastValue)
  },

  // @ts-ignore
  "mix($color1, $color2, $f: 0.5, $color-space: 'lrgb')": (
    color1: SassLegacyValue<Sass.Color>,
    color2: SassLegacyValue<Sass.Color>,
    f: SassLegacyValue<Sass.Number>,
    colorSpace: SassLegacyValue<Sass.String>
  ) => {
    assertNumber(f)
    assertColorMode(colorSpace)
    const [chromaColor1, chromaColor2] = [color1, color2].map((c) => {
      assertColor(c)
      return sass2Chroma(c)
    })
    const newColor = chroma.mix(
      chromaColor1,
      chromaColor2,
      f?.getValue(),
      colorSpace?.getValue() as chroma.InterpolationMode
    )
    return chroma2Sass(newColor)
  },

  /**
   * @see {@link chroma.Color.hcl}
   */

  // @ts-ignore
  'hcl($h, $c, $l)': (
    h: SassLegacyValue<Sass.Number>,
    c: SassLegacyValue<Sass.Number>,
    l: SassLegacyValue<Sass.Number>
  ) => {
    ;[h, c, l].forEach((channel) => assertNumber(channel))
    const chromaColor = chroma(
      [h.getValue(), c.getValue(), l.getValue()],
      'hcl'
    )
    return chroma2Sass(chromaColor)
  },
  /**
   * @see {@link chroma.Color.lch}
   */
  // @ts-ignore
  'lch($l,$c,$h)': (
    l: SassLegacyValue<Sass.Number>,
    c: SassLegacyValue<Sass.Number>,
    h: SassLegacyValue<Sass.Number>
  ) => {
    ;[l, c, h].forEach((channel) => assertNumber(channel))
    const chromaColor = chroma(
      [l.getValue(), c.getValue(), h.getValue()],
      'lch'
    )
    return chroma2Sass(chromaColor)
  },

  /**
   * @see {@link chroma.Color.oklch}
   */
  // @ts-ignore
  'oklch($l,$c,$h)': (
    l: SassLegacyValue<Sass.Number>,
    c: SassLegacyValue<Sass.Number>,
    h: SassLegacyValue<Sass.Number>
  ) => {
    ;[l, c, h].forEach((channel) => assertNumber(channel))

    const chromaColor = chroma(
      l.getValue(),
      c.getValue(),
      h.getValue(),
      'oklch'
    )
    return chroma2Sass(chromaColor)
  },

  // @ts-ignore
  "scale-steps($colors, $steps, $mode: 'lrgb')": (
    colors: SassLegacyValue<Sass.List>,
    steps: SassLegacyValue<Sass.Number>,
    mode: SassLegacyValue<Sass.String>
  ) => {
    assertList(colors)
    assertNumber(steps)
    assertColorMode(mode)

    const chromaColors = sassList2Array<
      chroma.Color,
      SassLegacyValue<Sass.Color>
    >(colors, (v) => sass2Chroma(v))
    const scale = chroma
      .scale(chromaColors)
      .correctLightness(true)
      .classes(steps.getValue())
      .mode(mode.getValue() as chroma.InterpolationMode)
      .colors(steps.getValue(), null)

    return array2SassList<chroma.Color, Sass.Color>(scale, (v) =>
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
   * @returns A {@link SassLegacyValue<Sass.Map>} of keyed colours. Iterate over it with `@each` to set CSS custom properties that can
   *
   * @remarks 'warm' and 'cool' are used here primarily because they're more memorable labels than 'primary' or 'secondary'. They *could* be 'warmer'/'cooler' colours, but they don't have to be; 'warm'/'cool' are more about a UX element's importance/activity (warmer = more active/dramatic).
   */
  // @ts-ignore
  "gamutize($fg-color, $bg-color, $warm-color, $cool-color, $prefix: 'palette')":
    (
      fgColor: SassLegacyValue<Sass.Color>,
      bgColor: SassLegacyValue<Sass.Color>,
      warmColor: SassLegacyValue<Sass.Color>,
      coolColor: SassLegacyValue<Sass.Color>,
      /**
       * @default 'palette'
       */
      prefix: SassLegacyValue<Sass.String>
    ) => {
      // typecheck the parameters SASS passed us
      ;[fgColor, bgColor, warmColor, coolColor].forEach((c) => assertColor(c))
      assertString(prefix)

      // establish the how the dark and light colours will be mapped to the foreground and background colours
      const ground = {
        fg: sass2Chroma(fgColor),
        bg: sass2Chroma(bgColor),
      }
      const lightness = {
        light: maxBy([ground.fg, ground.bg], (color) =>
          color?.luminance()
        ) as chroma.Color,
        dark: minBy([ground.fg, ground.bg], (color) =>
          color?.luminance()
        ) as chroma.Color,
      }
      const isDarkTheme = ground.fg.luminance() > ground.bg.luminance()

      const darkGround = isDarkTheme ? 'bg' : 'fg'
      const lightGround = isDarkTheme ? 'fg' : 'bg'

      const temperature = {
        warm: sass2Chroma(warmColor),
        cool: sass2Chroma(coolColor),
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
                throw new Sass.Error(
                  `Could not parse the last substring of ${colorKey}`
                )
              const oldScaleValue = parseInt(oldScaleValueSubstring)
              if (isNaN(oldScaleValue))
                throw new Sass.Error(
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
        key: new Sass.String(`${prefix.getValue()}-${colorKey}`),
        value: chroma2Sass(colorValue),
      }))

      return sassColors
    },
}

export default plugin
