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
 * @param {string} documentType The document type to get the mapping for.
 * @returns {Record<string,string>|undefined}
 */
export function getMapping(documentType) {
  const filePath = path.resolve(I18N_PATH, 'mappings.json')
  const json = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
  return json[documentType]
}

/**
 *
 * @param {PackData} packData The pack data object from `system.json`.
 * @param {string} documentType The expected document type.
 */
export function writeLocaleTemplate(packData, documentType) {
  const documentData = parseFoundryDb(packData)
  // TODO: flatten objects for key comparison
  const mapping = getMapping(documentType)
  if (!mapping) {
    throw new Error(`No mapping available for type: ${documentType}`)
  }
  const entries = {}

  documentData.forEach((document) => {
    const key = document.name
    if (!key) {
      throw new Error("Document data has no 'name' key.")
    }
    if (entries[key]) {
      throw new Error(`Duplicate ${document.type} key: ${key}`)
    }
    const documentLocale = {}

    _.forEach(mapping, (documentKey, mapKey) => {
      if (document.data) {
        documentKey = documentKey.replace('system.', 'data.')
      }
      const mappedValue = getProperty(document, documentKey)
      if (mappedValue) {
        console.log(`Mapping - ${documentKey}: ${mappedValue}`)
        if (typeof mappedValue === 'string' && mappedValue.length > 0) {
          documentLocale[mapKey] = mappedValue
        } else if (Array.isArray(mappedValue)) {
          if (mappedValue.length) {
            const filteredArray = mappedValue.map((mappedchild) =>
              _.pickBy(mappedchild, (_, key) => I18N_KEYS.includes(key))
            )
            documentLocale[mapKey] = filteredArray
          }
        } else {
          throw new Error(
            `Expected a string or an array for key "documentKey", but got: ${mappedValue}`
          )
        }
      }
    })
    entries[key] = documentLocale
  })

  const dataOut = { label: packData.label, mapping, entries }

  const json = JSON.stringify(dataOut, undefined, 2)
  const baseName = `${packData.system}.${path.basename(
    packData.path,
    'db'
  )}.json`
  const filePathOut = `${I18N_PATH}/packs/${baseName}`

  writeFileSync(filePathOut, json)
}

/**
 * @type {PackData[]}
 */
const testData = packs.filter((pack) =>
  ['Assets', 'Moves'].some((str) => pack.label.includes(str))
)

testData.forEach((pack) =>
  writeLocaleTemplate(pack, pack.name.includes('Assets') ? 'asset' : 'sfmove')
)
