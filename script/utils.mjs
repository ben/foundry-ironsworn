import _ from 'lodash'

// Object manipulation functions adapted from FVTT's source.
/**
 * Flatten a possibly multi-dimensional object to a one-dimensional one by converting all nested keys to dot notation
 * @param {object} obj        The object to flatten
 * @param {number} [_d=0]     Track the recursion depth to prevent overflow
 * @return {object}           A flattened object
 */

export function flattenObject(obj, _d = 0) {
  const flat = {}
  if (_d > 100) {
    throw new Error('Maximum depth exceeded')
  }
  for (let [k, v] of Object.entries(obj)) {
    if (_.isPlainObject(v)) {
      if (_.isEmpty(v)) flat[k] = v
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

export function setProperty(object, key, value) {
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

/**
 * A helper function which searches through an object to retrieve a value by a string key.
 * The method also supports arrays if the provided key is an integer index of the array.
 * The string key supports the notation a.b.c which would return object[a][b][c]
 * @param {object} object   The object to traverse
 * @param {string} key      An object property with notation a.b.c
 * @return {*}              The value of the found property
 */
export function getProperty(object, key) {
  if (!key) return undefined
  let target = object
  for (let p of key.split('.')) {
    if (!(_.isPlainObject(target) || Array.isArray(target))) return undefined
    if (p in target) target = target[p]
    else return undefined
  }
  return target
}
