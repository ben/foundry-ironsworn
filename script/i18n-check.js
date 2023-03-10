// import masterFile from '../system/lang/en.json' assert { type: 'json' }
import { readFileSync } from 'fs'
import { isPlainObject, isEmpty, forEach } from 'lodash-es'

// Object manipulation functions adapted from FVTT's source.

/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param {object} obj        The object to flatten
 * @param {number} [_d=0]     Track the recursion depth to prevent overflow
 * @return {object}           A flattened object
 */
function flattenObject(obj, _d = 0) {
  const flat = {}
  if (_d > 100) {
    throw new Error('Maximum depth exceeded')
  }
  for (let [k, v] of Object.entries(obj)) {
    if (isPlainObject(v)) {
      if (isEmpty(v)) flat[k] = v
      let inner = flattenObject(v, _d + 1)
      for (let [ik, iv] of Object.entries(inner)) {
        flat[`${k}.${ik}`] = iv
      }
    } else flat[k] = v
  }
  return flat
}

/**
 * Expand a flattened object to be a standard nested Object by converting all dot-notation keys to inner objects.
 * @param {object} obj      The object to expand
 * @param {number} [_d=0]   Track the recursion depth to prevent overflow
 * @return {object}         An expanded object
 */
export function expandObject(obj, _d = 0) {
  if (_d > 100) throw new Error('Maximum object expansion depth exceeded')

  // Recursive expansion function
  function _expand(value) {
    if (value instanceof Object) {
      if (Array.isArray(value)) return value.map(_expand)
      else return expandObject(value, _d + 1)
    }
    return value
  }

  // Expand all object keys
  const expanded = {}
  for (let [k, v] of Object.entries(obj)) {
    setProperty(expanded, k, _expand(v))
  }
  return expanded
}

/**
 * A helper function which searches through an object to assign a value using a string key
 * This string key supports the notation a.b.c which would target object[a][b][c]
 * @param {object} object   The object to update
 * @param {string} key      The string key
 * @param {*} value         The value to be assigned
 * @return {boolean}        Whether the value was changed from its previous value
 */
function setProperty(object, key, value) {
  let target = object
  let changed = false

  // Convert the key to an object reference if it contains dot notation
  if (key.indexOf('.') !== -1) {
    let parts = key.split('.')
    key = parts.pop()
    target = parts.reduce((o, i) => {
      if (!Object.prototype.hasOwnProperty.call(o, i)) o[i] = {}
      return o[i]
    }, object)
  }

  // Update the target
  if (target[key] !== value) {
    changed = true
    target[key] = value
  }

  // Return changed status
  return changed
}

const masterLocale = 'en'

const locales = ['en', 'de', 'es', 'fr', 'pl']

/**
 * @type {Record<string,Set<string>>}
 */
const localeKeys = {}

locales.forEach(
  (locale) =>
    (localeKeys[locale] = new Set(
      Object.keys(
        flattenObject(JSON.parse(readFileSync(`../system/lang/${locale}.json`)))
      )
    ))
)

forEach(localeKeys, (keys, locale) => {
  if (locale !== masterLocale) {
    const masterKeys = localeKeys[masterLocale]
    const extraKeys = difference(keys, masterKeys)
    console.log(`Extra keys in ${locale}.json:\n`, extraKeys)
    // const missingKeys = difference(masterKeys, keys)
    // console.log(`Missing keys in ${locale}.json:\n`, missingKeys)
  }
})

/**
 *
 * @param {Set<any>} setA
 * @param {Set<any>} setB
 * @returns {Set<any>}
 */
function difference(setA, setB) {
  const _difference = new Set(setA)
  for (const elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

// TODO: check that the variable name is consistent from string to string
