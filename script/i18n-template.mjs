import { getProperty, parseFoundryDb } from './utils.mjs'
import { readFileSync, writeFileSync } from 'fs'
import _ from 'lodash'
import systemData from '../system/system.json' assert { type: 'json' }
import path from 'path'
import {
  extractRollTableStrings,
  extractSiteThemeOrDomain,
} from './i18n-converters.mjs'

const { packs } = systemData

export const I18N_PATH = path.resolve(process.cwd(), 'i18n')
export const SYSTEM_PATH = path.resolve(process.cwd(), 'system')

const mappingsPath = path.resolve(I18N_PATH, 'mappings.json')

// "truth": {
//   "summary": "name",
//   "description": "system.Description",
//   "questStarter": "system.Quest Starter",
//   "table": "system.Subtable",
//   "text": "text.markdown"
// },
// "truth-category": {
//   "name": "name",
//   "pages": {
//     "path": "pages",
//     "converter": "truth"
//   }
// }

/**
 * @type {Record<string,string|Converter>}
 */
const mappings = JSON.parse(readFileSync(mappingsPath, { encoding: 'utf8' }))

/**
 * @typedef Converter
 * @property {string} path
 * @property {keyof typeof mappings} conveter
 */

/**
 * @typedef PackData
 * @property {string} name
 * @property {string} label
 * @property {string} system
 * @property {string} path
 * @property {string} type
 * @property {boolean} private
 */
export const I18N_TYPES = []
export const I18N_KEYS = [
  'Text',
  'text',
  'description',
  'Description',
  'name',
  'Name',
  'title',
  'Title',
  'label',
  'Label',
  'biography',
  'Result',
  'Quest Starter',
  'Subtable',
  'markdown',
]

/**
 *
 * @param {PackData} packData The pack data object from `system.json`.
 * @param {(document: DocumentData, mapping?: Record<string,unknown>) => Record<string, unknown>} converterFn The converter function to use.
 * @param {Record<string,unknown>} [mapping]
 */
export function writeLocaleTemplate(packData, converterFn, mapping) {
  const documentData = parseFoundryDb(packData)
  console.log(
    `Writing localization template for "${packData.label}" (${packData.path})...`
  )
  // TODO: flatten objects for key comparison

  const dataOut = { label: packData.label, mapping, entries: {} }

  console.log('dataOut', dataOut)

  documentData.forEach((document) => {
    if (document.data) {
      // this is a bit strict, but anything like this probably has other weird stuff happening, and accounting for that is more trouble than it's worth.
      throw new Error(
        'Document uses deprecated "data" property. Please migrate to FVTTv10+ "system" and try again.'
      )
    }
    dataOut.entries[document._id] = converterFn(document, mapping)
  })

  const json = JSON.stringify(dataOut, undefined, 2)
  const baseName = `${packData.system}.${path.basename(
    packData.path,
    '.db'
  )}.json`
  const filePathOut = `${I18N_PATH}/packs/${baseName}`

  writeFileSync(filePathOut, json)
}

function extractWithMapping(document, mapping) {
  const localeStrings = {}

  _.forEach(mapping, (oldKey, newKey) => {
    const mappedValue = getProperty(document, oldKey)
    if (mappedValue) {
      // console.log(`Mapping - ${documentKey}: ${mappedValue}`)
      if (typeof mappedValue === 'string' && mappedValue.length > 0) {
        localeStrings[newKey] = mappedValue
      } else if (Array.isArray(mappedValue)) {
        {
          const filteredArray = mappedValue.map((mappedchild) =>
            _.pickBy(
              mappedchild,
              (value, key) => I18N_KEYS.includes(key) && !_.isEmpty(value)
            )
          )
          if (
            filteredArray.length &&
            !filteredArray.every((value) => _.isEmpty(value))
          ) {
            localeStrings[newKey] = filteredArray
          }
        }
      } else {
        throw new Error(
          `Expected a string or an array for key "documentKey", but got: ${JSON.stringify(
            mappedValue
          )}`
        )
      }
    }
  })

  return localeStrings
}

/**
 * @type {PackData[]}
 */
const assetData = packs.filter((pack) => pack.label.includes('Assets'))
assetData.forEach((pack) =>
  writeLocaleTemplate(pack, extractWithMapping, mappings.asset)
)

/**
 * @type {PackData[]}
 */
const moveData = packs.filter((pack) => pack.label.includes('Moves'))
moveData.forEach((pack) =>
  writeLocaleTemplate(pack, extractWithMapping, mappings.sfmove)
)

/**
 * @type {PackData[]}
 */
const siteThemeData = packs.filter((pack) =>
  pack.label.includes('Delve Themes')
)
siteThemeData.forEach((pack) =>
  writeLocaleTemplate(pack, extractSiteThemeOrDomain, mappings['delve-theme'])
)

/**
 * @type {PackData[]}
 */
const siteDomainData = packs.filter((pack) =>
  pack.label.includes('Delve Domains')
)
siteDomainData.forEach((pack) =>
  writeLocaleTemplate(pack, extractSiteThemeOrDomain, mappings['delve-domain'])
)

/**
 * @type {PackData[]}
 */
const oracleData = packs.filter((pack) => pack.label.includes('Oracles'))
oracleData.forEach((pack) => writeLocaleTemplate(pack, extractRollTableStrings))
