import chroma from 'chroma-js'
import { types as Sass, LegacyValue as SassValue } from 'sass'

/**
 * Converts a {@link Sass.List} to a standard {@link Array}.
 */
export function sassList2Array<V, VSass extends SassValue = SassValue>(
  list: Sass.List,
  converter: (value: VSass) => V
) {
  const array: V[] = []
  for (let i = 1; i < list.getLength(); i++) {
    array.push(converter(list.getValue(i) as VSass))
  }
  return array
}

/**
 * Converts a standard {@link Array} to a {@link Sass.List}.
 * @param converter - A function used to convert each value in the original Array.
 */
export function array2SassList<V, VSass extends SassValue = SassValue>(
  array: V[],
  converter: (value: V) => VSass
) {
  const list = new Sass.List(array.length)
  array.forEach((v, i) => {
    list.setValue(i, converter(v))
  })
  return list
}

/**
 * Converts a standard {@link Map} to a {@link Sass.Map}.
 * @param map - The standard JS Map to be converted.
 * @param converter - A function used to convert each key/value pair in the original Map.
 */
export function map2SassMap<K, V, VSass extends SassValue = SassValue>(
  map: Map<K, V>,
  converter: (key: K, value: V) => { key: Sass.String; value: VSass }
) {
  const sassMap = new Sass.Map(map.size)
  let index = 0
  map.forEach((oldValue, oldKey) => {
    const { key, value } = converter(oldKey, oldValue)
    sassMap.setKey(index, key)
    sassMap.setValue(index, value)
    index++
  })
  return sassMap
}

/**
 * Converts a {@link chroma.Color} to a {@link Sass.Color}.
 */
export function chroma2Sass(color: chroma.Color) {
  const [red, green, blue, alpha] = color.rgba()
  return new Sass.Color(red, green, blue, alpha)
}
/**
 * Converts a {@link Sass.Color} to a  {@link chroma.Color}.
 */
export function sass2Chroma(color: Sass.Color) {
  return chroma({
    r: color.getR(),
    g: color.getG(),
    b: color.getB(),
    a: color.getA(),
  })
}
