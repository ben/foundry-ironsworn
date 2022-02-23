const marked = require('marked')
const fetch = require('node-fetch')
const fs = require('fs/promises')

function renderHtml(idMap, text, markedFn) {
  return markedFn(text
      .replace(/\[([^\]]+)\]\(([^#]+)#[^)]+\)/g, (link, name, kind) => {
        if (kind && kind !== 'Moves') return link;
        return `@Compendium[foundry-ironsworn.starforgedmoves.${idMap['Moves / ' + name]}]{${name}}`
      })
      .replace(/(roll ?)?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/gi, '((rollplus $2))')
      , { gfm: true })
}

async function dataforgedJson(name) {
  const url = `https://raw.githubusercontent.com/rsek/dataforged/main/${name}`
  console.log(`  Fetching ${url}`)
  const resp = await fetch(url)
  return resp.json()
}

async function fetchDataforged() {
  console.log('  Fetching Dataforged')
  const assetsPromise = dataforgedJson('next/assets.json')
  const encountersPromise = dataforgedJson('next/encounters.json')
  const movesPromise = dataforgedJson('next/moves.json')
  const oraclesPromise = dataforgedJson('next/oracles.json')
  const truthsPromise = dataforgedJson('setting_truths.json')

  return {
    'assets.json': await assetsPromise,
    'encounters.json': await encountersPromise,
    'moves.json': await movesPromise,
    'oracles.json': await oraclesPromise,
    'setting_truths.json': await truthsPromise,
  }
}

async function writeLocal(name, obj) {
  console.log(`  Writing sf-${name}.json`)
  return fs.writeFile(`system/assets/sf-${name}.json`, JSON.stringify(obj, null, 2) + '\n')
}

function base62(integer) {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (integer === 0) {
    return 0
  }
  let s = [];
  while (integer > 0) {
    s = [charset[integer % 62], ...s];
    integer = Math.floor(integer / 62);
  }
  return s.join('');
}

// Could get clever and ensure IDs are stable, but dataforged may switch to
// base62 ids and that would obviate the need for this at all.
function buildIdMap(df) {
  const idMap = {};
  const dfFileKeys = Object.keys(df);
  for (let keyIx = 0; keyIx < dfFileKeys.length; keyIx++) {
    const paddedFileId = String(base62(keyIx + 1)).padStart(2, '0')
    const json = df[dfFileKeys[keyIx]]
    const nodeStack = Array.isArray(json) ? Array.from(json).reverse() : [json]
    let itemIndex = 0
    while (nodeStack.length) {
      const node = nodeStack.pop()
      if (node && node['$id']) {
        const paddedId = String(base62(++itemIndex)).padStart(12, '0')
        idMap[node['$id']] = `DF${paddedFileId}${paddedId}`
      }
      if (Array.isArray(node)) {
        nodeStack.push(...Array.from(node).reverse())
      } else if (node instanceof Object) {
        nodeStack.push(...Array.from(Object.values(node)).reverse())
      }
    }
  }
  return idMap
}

function processAssets(idMap, en, df) {
  console.log('Assets:')

  for (const dfAsset of df['assets.json']) {
    for (const dfAbility of dfAsset['Abilities']) {
      dfAbility['Text'] = renderHtml(idMap, dfAbility['Text'], marked.parse)
    }
  }

  return df['assets.json']
}

function processEncounters(idMap, en, df) {
  console.log('Encounters:')

  // No actual work needs doing, no Markdown yet.
  for (const dfEncounter of df['encounters.json']) {
    // noop
  }

  return df['encounters.json']
}

const DF_MOVE_TEXT_REGEX = /([\s\S]+?)(On a \*\*strong hit\*\*, [\s\S]+?)(On a \*\*weak hit\*\*, [\s\S]+?)(On a \*\*miss\*\*, [\s\S]+)/
function processMoves(idMap, en, df) {
  console.log('Moves:')

  for (const dfMove of df['moves.json']) {
    let [_, description, strong, weak, miss] = dfMove['Text'].match(DF_MOVE_TEXT_REGEX) || []

    const markedIfDef = (text) => text ? renderHtml(idMap, text, marked.parse) : undefined;
    dfMove['Text'] = renderHtml(idMap, dfMove['Text'], marked.parse)
    dfMove['Description'] = description ? renderHtml(idMap, description, marked.parse) : dfMove['Text']
    if (dfMove['Outcomes']) {
      dfMove['Outcomes']['Strong Hit']['Text'] = markedIfDef(dfMove['Outcomes']['Strong Hit']['Text'])
      dfMove['Outcomes']['Weak Hit']['Text'] = markedIfDef(dfMove['Outcomes']['Weak Hit']['Text'])
      dfMove['Outcomes']['Miss']['Text'] = markedIfDef(dfMove['Outcomes']['Miss']['Text'])
    }
  }

  // Also write descriptions to en lang file
  en.IRONSWORN.MoveContents = en.IRONSWORN.MoveContents || {}
  for (const dfMove of df['moves.json']) {
    const move = {
      ...en.IRONSWORN.MoveContents[dfMove.Name],
      title: dfMove['Name'],
      description: dfMove['Description'],
      strong: dfMove['Outcomes'] ? dfMove['Outcomes']['Strong Hit']['Text'] : undefined,
      weak: dfMove['Outcomes'] ? dfMove['Outcomes']['Weak Hit']['Text'] : undefined,
      miss: dfMove['Outcomes'] ? dfMove['Outcomes']['Miss']['Text'] : undefined,
    }
    en.IRONSWORN.MoveContents[dfMove.Name] = move
  }

  return df['moves.json']
}

function processOracles(idMap, en, df) {
  console.log('Oracles:')

  for (const dfCategory of df['oracles.json']) {
    for (const dfOracle of dfCategory['Oracles']) {
      if (dfOracle['Description']) {
        dfOracle['Description'] = renderHtml(idMap, dfOracle['Description'], marked.parse);
      }
      if (dfOracle['Table']) {
        for (const dfTableRow of dfOracle['Table']) {
          dfTableRow['Result'] = renderHtml(idMap, dfTableRow['Result'], marked.parseInline)
        }
      }
    }
  }

  return df['oracles.json']
}

function processSettingTruths(idMap, en, df) {
  console.log('Truths:')

  en.IRONSWORN.SFSettingTruths = en.IRONSWORN.SFSettingTruths || {}
  for (const dfTruthCategory of df['setting_truths.json']["Setting Truths"]) {
    en.IRONSWORN.SFSettingTruths[dfTruthCategory.Name] = {
      ...en.IRONSWORN.SFSettingTruths[dfTruthCategory.Name],
      name: dfTruthCategory.Name,
    }
    for (let i = 0; i < dfTruthCategory.Table.length; i++) {
      const dfTruth = dfTruthCategory.Table[i]
      const truth = {
        Description: dfTruth.Description,
        Details: dfTruth.Details,
        Quest: dfTruth['Quest Starter'],
      }
      for (let j = 0; j < (dfTruth.Table || []).length; j++) {
        truth[`suboption${j + 1}`] = dfTruth.Table[j].Description
      }
      en.IRONSWORN.SFSettingTruths[dfTruthCategory.Name][`option${i + 1}`] = truth
    }
  }

  return df['setting_truths.json']
}

async function doit() {
  const en = JSON.parse(await fs.readFile('system/lang/en.json'))
  const df = await fetchDataforged()
  const idMap = buildIdMap(df)

  const writePromises = [
    writeLocal('assets', processAssets(idMap, en, df)),
    writeLocal('encounters', processEncounters(idMap, en, df)),
    writeLocal('moves', processMoves(idMap, en, df)),
    writeLocal('oracles', processOracles(idMap, en, df)),
    writeLocal('setting-truths', processSettingTruths(idMap, en, df)),
    writeLocal('ids', idMap),
  ]
  await Promise.all(writePromises)

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
