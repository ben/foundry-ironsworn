import _ from 'lodash'

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
export function extractPagesStrings(pages) {
  const pagesData = {}
  pages.forEach((page) => pagesData[page.name])
}
