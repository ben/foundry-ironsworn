import Chroma from 'chroma-js'
import * as Sass from 'sass'

/**
 * Converts a {@link Sass.types.List} to a standard {@link Array}.
 */
export function sassList2Array<
	V,
	VSass extends Sass.LegacyValue = Sass.LegacyValue
>(list: Sass.types.List, converter: (value: VSass) => V) {
	const array: V[] = []
	for (let i = 1; i < list.getLength(); i++) {
		array.push(converter(list.getValue(i) as VSass))
	}
	return array
}

/**
 * Converts a standard {@link Array} to a {@link Sass.types.List}.
 * @param converter - A function used to convert each value in the original Array.
 */
export function array2SassList<
	V,
	VSass extends Sass.LegacyValue = Sass.LegacyValue
>(array: V[], converter: (value: V) => VSass) {
	const list = new Sass.types.List(array.length)
	array.forEach((v, i) => {
		list.setValue(i, converter(v))
	})
	return list
}

/**
 * Converts a standard {@link Map} to a {@link Sass.types.Map}.
 * @param map - The standard JS Map to be converted.
 * @param converter - A function used to convert each key/value pair in the original Map.
 */
export function map2SassMap<
	K,
	V,
	VSass extends Sass.LegacyValue = Sass.LegacyValue
>(
	map: Map<K, V>,
	converter: (key: K, value: V) => { key: Sass.types.String; value: VSass }
) {
	const sassMap = new Sass.types.Map(map.size)
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
 * Converts a {@link Chroma.Color} to a {@link Sass.types.Color}.
 */
export function chroma2Sass(color: Chroma.Color) {
	const [red, green, blue, alpha] = color.rgba()
	return new Sass.types.Color(red, green, blue, alpha)
}
/**
 * Converts a {@link Sass.types.Color} to a  {@link Chroma.Color}.
 */
export function sass2Chroma(color: Sass.types.Color) {
	return Chroma.rgb(color.getR(), color.getG(), color.getB(), color.getA())
}
