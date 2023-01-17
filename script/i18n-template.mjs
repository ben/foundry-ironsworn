import { flattenObject, getProperty } from './utils.mjs'
import { readFileSync, writeFileSync } from 'fs'
import _ from 'lodash'
import systemData from '../system/system.json' assert { type: 'json' }
import path from 'path'

const { packs } = systemData

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
export const I18N_PATH = path.resolve(process.cwd(), 'i18n')
export const SYSTEM_PATH = path.resolve(process.cwd(), 'system')

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
]

/**
 * Parses a Foundry `*.db` file as an array of JSON objects.
 * @param {PackData} packData The pack data object from `system.json`.
 * @returns {Array<object>}
 */
export function parseFoundryDb(packData) {
  const rawData = readFileSync(
    path.resolve(process.cwd(), 'system', packData.path),
    {
      encoding: 'utf8',
    }
  )
  const splitData = _.compact(rawData.split(/\n/g))
  const documents = splitData.map((document) => {
    // console.log('attempting to parse as JSON', document)
    const newObj = JSON.parse(document)
    // console.log(newObj)
    return newObj
  })
  return _.compact(documents)
}

/**
 *
 * @param {PackData} packData The pack data object from `system.json`.
 */
export function writeLocaleTemplate(packData) {
  const mappingFilePath = path.resolve(I18N_PATH, 'mappings.json')
  const mappingData = JSON.parse(
    readFileSync(mappingFilePath, { encoding: 'utf8' })
  )
  const documentData = parseFoundryDb(packData)
  console.log(
    `Writing localization template for "${packData.label}" (${packData.path})...`
  )
  // TODO: flatten objects for key comparison

  const dataOut = { label: packData.label, mapping: {}, entries: {} }

  documentData.forEach((document) => {
    const mapping = mappingData[document.type]

    if (!mapping) {
      throw new Error(`No mapping available for type: ${document.type}`)
    }

    const key = document.name
    if (!key) {
      throw new Error("Document data has no 'name' key.")
    }
    if (dataOut.entries[key]) {
      throw new Error(`Duplicate ${document.type} key: ${key}`)
    }

    const documentLocale = {}

    _.forEach(mapping, (oldKey, newKey) => {
      if (document.data) {
        throw new Error(
          'Document uses deprecated "data" property. Please migrate to FVTTv10+ "system" and try again.'
        )
      }
      const mappedValue = getProperty(document, oldKey)
      if (mappedValue) {
        // console.log(`Mapping - ${documentKey}: ${mappedValue}`)
        if (typeof mappedValue === 'string' && mappedValue.length > 0) {
          documentLocale[newKey] = mappedValue
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
              documentLocale[newKey] = filteredArray
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
    dataOut.entries[key] = documentLocale

    if (_.isEmpty(dataOut.mapping)) {
      dataOut.mapping = mapping
    }
  })

  const json = JSON.stringify(dataOut, undefined, 2)
  const baseName = `${packData.system}.${path.basename(
    packData.path,
    '.db'
  )}.json`
  const filePathOut = `${I18N_PATH}/packs/${baseName}`

  writeFileSync(filePathOut, json)
}

/**
 * @type {PackData[]}
 */
const assetData = packs.filter((pack) => pack.label.includes('Assets'))
assetData.forEach((pack) => writeLocaleTemplate(pack))

/**
 * @type {PackData[]}
 */
const moveData = packs.filter((pack) => pack.label.includes('Moves'))
moveData.forEach((pack) => writeLocaleTemplate(pack))

/**
 * @type {PackData[]}
 */
const siteThemeData = packs.filter((pack) =>
  pack.label.includes('Delve Themes')
)
siteThemeData.forEach((pack) => writeLocaleTemplate(pack))

/**
 * @type {PackData[]}
 */
const siteDomainData = packs.filter((pack) =>
  pack.label.includes('Delve Domains')
)
siteDomainData.forEach((pack) => writeLocaleTemplate(pack))
