export function capitalize(txt: string) {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
}

/**
 * Returns the relative luminance of a
 * Adapted from https://gist.github.com/jfsiii/5641126
 */
export function relativeLuminanceW3C(
  R8bit: number,
  G8bit: number,
  B8bit: number
) {
  const RsRGB = R8bit / 255
  const GsRGB = G8bit / 255
  const BsRGB = B8bit / 255

  const R =
    RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4)
  const G =
    GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4)
  const B =
    BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4)

  // For the sRGB colorspace, the relative luminance of a color is defined as:
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B

  return L
}
