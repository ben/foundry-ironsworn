import { flattenObject } from './utils.mjs'
import * as masterFile from '../system/lang/en.json'
import _ from 'lodash'

const masterLocale = 'en'

const locales = ['en', 'de', 'es', 'fr', 'pl']

/**
 * @type {Record<string,Set<string>>}
 */
const localeKeys = {}

locales.forEach(
  (locale) =>
    (localeKeys[locale] = new Set(
      Object.keys(flattenObject(import(`../system/lang/${locale}.json`)))
    ))
)

_.forEach(localeKeys, (keys, locale) => {
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
