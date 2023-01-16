import { readFileSync } from "fs";
import * as mappings from "../i18n/mappings.json"

/**
 * Parses a Foundry `*.db` file as
 * @param {string} path The path to the `*.db` file to be loaded.
 * @returns {Array<object>}
 */
export function parseFoundryDb(path) {
  const rawData = readFileSync(path, {encoding: 'utf8'})
  const splitData = rawData.split(/\n/g)
  const documents = splitData.map((document) => JSON.parse(document))
  return documents
}

export function getMapping(documentType)

/**
 *
 * @param {Array<object>} documentData An array of document data to be parsed.
 * @param {object} mapping The object that maps
 * @param {string} fileOut The file path the JSON template will be written to.
 */
export function writeLocaleTemplate(documentData, mapping, fileOut) {
  // TODO: flatten objects for key comparison

  const entries = {}


  // TODO: throw an error if there's duplicate keys
}