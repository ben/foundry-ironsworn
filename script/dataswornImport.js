const marked = require('marked')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const util = require('util')

function renderHtml(text) {
  return marked(text.replace(/(roll ?)?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/gi, '((rollplus $2))'), { gfm: true })
}

async function dataswornJson(name) {
  const resp = await fetch(`https://raw.githubusercontent.com/rsek/datasworn/master/${name}.json`)
  return resp.json()
}

async function writeLocal(name, obj) {
  return fs.writeFile(`system/assets/${name}.json`, JSON.stringify(obj, null, 2) + '\n')
}

function processMove(move) {
  const resultRegex = /([\s\S]+?)(On a \*\*strong hit\*\*, [\s\S]+?)(On a \*\*weak hit\*\*, [\s\S]+?)(On a \*\*miss\*\*, [\s\S]+)/
  let [_, description, strong, weak, miss] = move.Text.match(resultRegex) || []

  // Fixup for Delve the Depths; the table is in the wrong place
  if (move.Name === 'Delve the Depths') {
    const tableRegex = /(Edge\s+\|\s+Shadow[\s\S]+)/
    const table = miss.match(tableRegex)[1]
    miss = miss.replace(tableRegex, '')
    weak += table
  }

  // Fixup for Sojourn; we want the info in several places
  if (move.Name === 'Sojourn') {
    const categories =
      'Clear a Condition\n\n  * Mend: Clear a wounded debility and take +1 health.\n  * Hearten: Clear a shaken debility and take +1 spirit.\n  * Equip: Clear an unprepared debility and take +1 supply. \n\nRecover\n\n  * Recuperate: Take +2 health for yourself and any companions.\n  * Consort: Take +2 spirit.\n  * Provision: Take +2 supply.\n  * Plan: Take +2 momentum. \n\nProvide Aid\n\n  * Take a quest: Envision what this community needs, or what trouble it is facing (*Ask the Oracle* if unsure). If you chose to help, *Swear an Iron Vow* and add +1.'

    description = 'When **you spend time in a community seeking assistance**, roll +heart. If you share a bond, add +1.'
    strong = `On **strong hit**, you and your allies may each choose two from within the categories below. If you share a bond, choose one more.\n\n${categories}`
    weak = `On a **weak hit**, you and your allies may each choose one from within the categories below. If you share a bond, choose one more.\n\n${categories}`
    miss = 'On a **miss**, you find no help here. *Pay the Price*.'
  }

  if (!description) description = move.Text

  return { description, strong, weak, miss }
}

async function doit() {
  // Assets
  console.log('Assets:')
  console.log('  Fetching')
  const assetsJson = await dataswornJson('ironsworn_assets')

  const assets = []
  for (const asset of assetsJson.Assets) {
    const track = {
      enabled: false,
      name: '',
      max: 0,
      current: 0,
    }
    if (asset['Asset Track']) {
      track.enabled = true
      track.name = asset['Asset Track'].Name
      track.max = asset['Asset Track'].Max
      track.current = asset['Asset Track']['Starting Value'] ?? track.max
    }

    const exclusiveOptions = []
    for (const option of asset.MultiFieldAssetTrack?.Fields || []) {
      exclusiveOptions.push({
        name: option.ActiveText,
        selected: option.IsActive,
      })
    }

    assets.push({
      name: `${asset['Asset Type']} / ${asset.Name}`,
      data: {
        description: asset.Description,
        fields: (asset['Input Fields'] || []).map((x) => ({
          name: x,
          value: '',
        })),
        abilities: asset.Abilities.map((x) => {
          const description = x.Name ? `**${x.Name}:** ${x.Text}` : x.Text
          return {
            enabled: x.Enabled || false,
            description: renderHtml(description),
          }
        }),
        track,
        exclusiveOptions,
      },
    })
  }
  console.log('  Writing')
  await writeLocal('assets', assets)

  // Moves
  console.log('Moves:')
  console.log('  Fetching')
  const movesJson = await dataswornJson('ironsworn_moves')
  const moveOraclesJson = await dataswornJson('ironsworn_move_oracles')

  // Just grab Datasworn, but split up the text into more structure
  const i18nMoves = []
  for (const category of movesJson.Categories) {
    for (let move of category.Moves) {
      const { description, strong, weak, miss } = processMove(move)

      delete move.Text
      move.Description = marked(description || '') || undefined
      move.Strong = marked(strong || '') || undefined
      move.Weak = marked(weak || '') || undefined
      move.Miss = marked(miss || '') || undefined

      const oracles = moveOraclesJson.Oracles.filter((x) => x.Move === move.Name)
      if (oracles.length > 0) {
        move.oracles = oracles.map((oracle) => {
          const stat = (oracle.Name.match(/ - (.*)$/) || [])[1]?.toLowerCase()
          const obj = {
            name: oracle.Name,
            stat,
            table: [],
          }
          let low = 1
          for (const entry of oracle['Oracle Table']) {
            obj.table.push({
              low,
              high: entry.Chance,
              description: marked.parseInline(entry.Description),
            })
            low = entry.Chance + 1
          }
          return obj
        })
      }

      i18nMoves.push(move)
    }
  }
  console.log('  Writing')
  await writeLocal('moves', movesJson)

  // Also write descriptions to en lang file
  const en = JSON.parse(await fs.readFile('system/lang/en.json'))
  en.IRONSWORN.MoveContents ||= {}
  for (const move of i18nMoves) {
    const obj = {
      ...en.IRONSWORN.MoveContents[move.Name],
      title: move.Name,
      description: move.Description,
      strong: move.Strong,
      weak: move.Weak,
      miss: move.Miss,
    }
    if (move.oracles) {
      obj.oracles = {}
      for (const oracle of Object.values(move.oracles)) {
        obj.oracles[oracle.name] = {}
        let i = 1
        for (const entry of oracle.table) {
          obj.oracles[oracle.name][`entry${i}`] = entry.description
          i++
        }
      }
    }
    en.IRONSWORN.MoveContents[move.Name] = obj
  }

  // Delve: themes
  console.log('Delve themes:')
  console.log('  Fetching')
  const delveThemesJson = await dataswornJson('ironsworn_delve_themes')

  // Write local version
  console.log('  Writing')
  await writeLocal('delve-themes', delveThemesJson)

  // Add text to en.json
  en.IRONSWORN.ThemeContents ||= {}
  for (const theme of delveThemesJson.Themes) {
    en.IRONSWORN.ThemeContents[theme.Name] = {
      ...en.IRONSWORN.ThemeContents[theme.Name],
      title: theme.Name,
      summary: theme.Summary,
      description: marked(theme.Description),
    }
    for (let i = 0; i < theme.Features.length; i++) {
      const feature = theme.Features[i]
      en.IRONSWORN.ThemeContents[theme.Name][`feature${i + 1}`] = feature.Description
    }
    for (let i = 0; i < theme.Dangers.length; i++) {
      const danger = theme.Dangers[i]
      en.IRONSWORN.ThemeContents[theme.Name][`danger${i + 1}`] = danger.Description
    }
  }

  console.log('Delve domains:')
  console.log('  Fetching')
  const delveDomainsJson = await dataswornJson('ironsworn_delve_domains')

  // Write local version
  console.log('  Writing')
  await writeLocal('delve-domains', delveDomainsJson)

  // Add text to en.json
  en.IRONSWORN.DomainContents ||= {}
  for (const domain of delveDomainsJson.Domains) {
    en.IRONSWORN.DomainContents[domain.Name] = {
      ...en.IRONSWORN.DomainContents[domain.Name],
      title: domain.Name,
      summary: domain.Summary,
      description: marked(domain.Description),
    }
    for (let i = 0; i < domain.Features.length; i++) {
      const feature = domain.Features[i]
      en.IRONSWORN.DomainContents[domain.Name][`feature${i + 1}`] = feature.Description
    }
    for (let i = 0; i < domain.Dangers.length; i++) {
      const danger = domain.Dangers[i]
      en.IRONSWORN.DomainContents[domain.Name][`danger${i + 1}`] = danger.Description
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
