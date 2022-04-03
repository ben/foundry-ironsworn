const marked = require('marked')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const { createHash } = require('crypto')
const { get, set } = require('lodash')

function renderHtml(idMap, text, markedFn) {
  return markedFn(
    text
      .replace(/\[([^\]]+)\]\(([^#]+)#[^)]+\)/g, (link, name, kind) => {
        if (kind && kind !== 'Moves') return link
        return `@Compendium[foundry-ironsworn.starforgedmoves.${idMap['Moves / ' + name]}]{${name}}`
      })
      .replace(/(roll ?)?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/gi, '((rollplus $2))'),
    { gfm: true }
  )
}

async function dataforgedJson(name) {
  const url = `https://raw.githubusercontent.com/rsek/dataforged/main/${name}`
  console.log(`  Fetching ${url}`)
  const resp = await fetch(url)
  return resp.json()
}

async function fetchDataforged() {
  console.log('  Fetching Dataforged')
  const assetsPromise = dataforgedJson('starforged-assets.json')
  const encountersPromise = dataforgedJson('starforged-encounters.json')
  const movesPromise = dataforgedJson('starforged-moves.json')
  const oraclesPromise = dataforgedJson('starforged-oracles.json')
  const truthsPromise = dataforgedJson('starforged-setting_truths.json')

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
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (integer === 0) {
    return 0
  }
  let s = []
  while (integer > 0) {
    s = [charset[integer % 62], ...s]
    integer = Math.floor(integer / 62)
  }
  return s.join('')
}

function idHash(file, str) {
  const hasher = createHash('sha256')
  hasher.update('6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50') // salt
  hasher.update(file)
  hasher.update(str)
  return hasher.digest('hex').toString().substring(48)
}

function buildIdMap(df) {
  const idMap = {}
  const dfFileKeys = Object.keys(df)
  for (const fileKey of dfFileKeys) {
    const json = df[fileKey]
    const nodeStack = Array.isArray(json) ? Array.from(json).reverse() : [json]
    while (nodeStack.length) {
      const node = nodeStack.pop()
      if (node && node['$id']) {
        idMap[node['$id']] = idHash(fileKey, node['$id'])
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

function processAssets(idMap, df) {
  console.log('Assets:')

  for (const dfAsset of df['assets.json']) {
    for (const dfAbility of dfAsset['Abilities']) {
      dfAbility['Text'] = renderHtml(idMap, dfAbility['Text'], marked.parse)
    }
  }

  return df['assets.json']
}

function processEncounters(idMap, df) {
  console.log('Encounters:')

  // No actual work needs doing, no Markdown yet.
  for (const dfEncounter of df['encounters.json']) {
    // noop
  }

  return df['encounters.json']
}

const DF_MOVE_TEXT_REGEX = /([\s\S]+?)(On a \*\*strong hit\*\*, [\s\S]+?)(On a \*\*weak hit\*\*, [\s\S]+?)(On a \*\*miss\*\*, [\s\S]+)/
function processMoves(idMap, df) {
  console.log('Moves:')

  const markdownRenderers = {
    Text: marked.parse,
    'Trigger.Text': marked.parseInline,
    'Outcomes.Strong Hit.Text': marked.parse,
    'Outcomes.Strong Hit.With a Match.Text': marked.parse,
    'Outcomes.Weak Hit.Text': marked.parse,
    'Outcomes.Miss.Text': marked.parse,
    'Outcomes.Miss.With a Match.Text': marked.parse,
  }

  for (const dfMove of df['moves.json']) {
    for (const [k, renderer] of Object.entries(markdownRenderers)) {
      const md = get(dfMove, k)
      if (md) {
        set(dfMove, k, renderHtml(idMap, md, renderer))
      }
    }
  }

  return df['moves.json']
}

function processOracles(idMap, df) {
  console.log('Oracles:')

  for (const dfCategory of df['oracles.json']) {
    for (const dfOracle of dfCategory['Oracles']) {
      if (dfOracle['Description']) {
        dfOracle['Description'] = renderHtml(idMap, dfOracle['Description'], marked.parse)
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

function processSettingTruths(idMap, df) {
  console.log('Truths:')

  for (const dfTruthCategory of df['setting_truths.json']['Setting Truths']) {
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
    }
  }

  return df['setting_truths.json']
}

async function doit() {
  const df = await fetchDataforged()
  const idMap = buildIdMap(df)

  const writePromises = [
    writeLocal('assets', processAssets(idMap, df)),
    writeLocal('encounters', processEncounters(idMap, df)),
    writeLocal('moves', processMoves(idMap, df)),
    writeLocal('oracles', processOracles(idMap, df)),
    // writeLocal('setting-truths', processSettingTruths(idMap, df)),
    writeLocal('ids', idMap),
  ]
  await Promise.all(writePromises)
}

doit().then(
  () => process.exit(),
  (err) => {
    console.error(err)
    process.exit(-1)
  }
)
