const marked = require('marked')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const util = require('util')

function renderHtml(text) {
  return marked.parse(text.replace(/(roll ?)?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/gi, '((rollplus $2))'), { gfm: true })
}

async function dataforgedJson(name) {
  const resp = await fetch(`https://raw.githubusercontent.com/rsek/dataforged/main/${name}.json`)
  return resp.json()
}

async function writeLocal(name, obj) {
  return fs.writeFile(`system/assets/${name}.json`, JSON.stringify(obj, null, 2) + '\n')
}

async function doit() {
  const en = JSON.parse(await fs.readFile('system/lang/en.json'))

  console.log('Truths:')
  console.log('  Fetching')
  const truthsJson = await dataforgedJson('setting_truths')

  console.log('  Writing')
  await writeLocal('sf-setting-truths', truthsJson)

  en.IRONSWORN.SFSettingTruths ||= {}
  for (const truthCategory of truthsJson['Setting Truths']) {
    en.IRONSWORN.SFSettingTruths[truthCategory.Name] = {
      ...en.IRONSWORN.SFSettingTruths[truthCategory.Name],
      name: truthCategory.Name,
    }
    for (let i = 0; i < truthCategory.Table.length; i++) {
      const option = truthCategory.Table[i]
      const blob = {
        Description: option.Description,
        Details: option.Details,
        Quest: option['Quest Starter'],
      }
      for (let j = 0; j < (option.Table || []).length; j++) {
        blob[`suboption${j + 1}`] = option.Table[j].Description
      }
      en.IRONSWORN.SFSettingTruths[truthCategory.Name][`option${i + 1}`] = blob
    }
  }

  console.log('Writing en.json')
  await fs.writeFile('system/lang/en.json', JSON.stringify(en, null, 2) + '\n')
}

doit().then(
  () => process.exit(),
  (err) => {
    console.error(err)
    process.exit(-1)
  }
)
