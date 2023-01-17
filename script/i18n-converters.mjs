/**
 * Extracts localizeable strings from table results.
 * @param {Array<TableResultData>} results
 * @returns {Record<string,string>}
 */
function extractTableResultStrings(results) {
  const rowData = {}
  results.forEach((result) => {
    rowData[`${result.range[0]}-${result.range[1]}`] = result.text
  })
  return rowData
}

/**
 * Extract text from Dataforged-style rows (currently only used in Truth journal entry system data).
 * @param {Array<IRow>} oracleRows
 * @returns {Record<string,string>}
 */
export function extractDfOracleRowStrings(oracleRows) {
  const rowData = {}
  oracleRows.forEach((row) => {
    rowData[`${row.Floor}-${row.Ceiling}`] = row.Result
  })
  return rowData
}

/**
 * Extracts localizeable strings from a rollable table.
 * @param {RollTableData} rollTable
 */
export function extractRollTableStrings(rollTable) {
  const tableData = {
    name: rollTable.name,
    description: rollTable.description.lenegth
      ? rollTable.description
      : undefined,
    results: extractTableResultStrings(rollTable.results),
  }
  return tableData
}

/**
 *
 * @param {Array<JournalEntryPageData>} pages
 */
export function extractTruthPageStrings(pages) {
  const pagesData = {}
  pages.forEach(
    (page) =>
      (pagesData[page.name] = {
        summary: page.name,
        description: page.system.Description,
        results: extractDfOracleRowStrings(page.system.Subtable),
        questStarter: page.system['Quest Starter'],
      })
  )
  return pagesData
}

/**
 * @param {JournalEntryData}
 */
export function extractTruthJournalStrings(journalEntry) {
  const localeData = {
    name: journalEntry.Name,
    options: extractTruthPageStrings(journalEntry.pages),
    characterInspiration: journalEntry,
  }
  return localeData
}

/**
 * @typedef { import("../src/module/item/itemtypes").FeatureOrDanger } FeatureOrDanger
 */

/**
 * @param {Array<FeatureOrDanger>} featuresOrDangers
 */
export function extractSiteFeaturesOrDangers(featuresOrDangers) {
  const localeData = {}
  featuresOrDangers.forEach((featureOrDanger) => {
    localeData[`${featureOrDanger.low}-${featureOrDanger.high}`] =
      featureOrDanger.description
  })
  return localeData
}

/**
 * @param { import("../src/module/item/itemtypes").DelveThemeDataSource | import("../src/module/item/itemtypes").DelveDomainDataSource } themeOrDomain
 */
export function extractSiteThemeOrDomain(themeOrDomain) {
  // console.log('extractSiteThemeOrDomain', themeOrDomain)
  const localeData = {
    name: themeOrDomain.name,
    summary: themeOrDomain.system.summary,
    description: themeOrDomain.system.description,
    features: extractSiteFeaturesOrDangers(themeOrDomain.system.features),
    dangers: extractSiteFeaturesOrDangers(themeOrDomain.system.dangers),
  }
  return localeData
}
