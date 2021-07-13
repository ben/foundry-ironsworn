const marked = require('marked')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const util = require('util')

function renderHtml (text) {
  return marked(
    text.replace(
      /(roll ?)?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/gi,
      '((rollplus $2))'
    ),
    { gfm: true }
  )
}

async function doit () {
  // Assets
  console.log('Assets:')
  console.log('  Fetching')
  const assetsJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_assets.json'
  ).then(x => x.json())

  console.log('  Processing')
  const assets = []
  for (const asset of assetsJson.Assets) {
    const track = {
      enabled: false,
      name: '',
      max: 0,
      current: 0
    }
    if (asset['Asset Track']) {
      track.enabled = true
      track.name = asset['Asset Track'].Name
      track.max = asset['Asset Track'].Max
      track.current = asset['Asset Track']['Starting Value'] ?? track.max
    }

    const exclusiveOptions = []
    for (const option of (asset.MultiFieldAssetTrack?.Fields || [])) {
      exclusiveOptions.push({
        name: option.ActiveText,
        selected: option.IsActive
      })
    }

    assets.push({
      name: `${asset['Asset Type']} / ${asset.Name}`,
      data: {
        description: asset.Description,
        fields: (asset['Input Fields'] || []).map(x => ({
          name: x,
          value: ''
        })),
        abilities: asset.Abilities.map(x => {
          const description = x.Name ? `**${x.Name}:** ${x.Text}` : x.Text
          return {
            enabled: x.Enabled || false,
            description: renderHtml(description)
          }
        }),
        track,
        exclusiveOptions,
      }
    })
  }
  console.log('  Writing')
  await fs.writeFile('system/assets/assets.json', JSON.stringify(assets, null, 2) + '\n')

  // Moves
  console.log('Moves:')
  console.log('  Fetching')
  const movesJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_moves.json'
    ).then(x => x.json())

    // Just grab Datasworn, but split up the text into more structure
    console.log('  Processing')
  const i18nMoves = []
  for (const category of movesJson.Categories) {
    for (let move of category.Moves) {
      let [_, Description, Strong, Weak, Miss] = move.Text.match(
        /([\s\S]+)(On a \*\*strong hit\*\*, [\s\S]+)(On a \*\*weak hit\*\*, [\s\S]+)(On a \*\*miss\*\*, [\s\S]+)/
      ) || []
      if (!Description) Description = move.Text
      delete move.Text

      move.Description = marked(Description || '') || undefined,
      move.Strong = marked(Strong || '') || undefined,
      move.Weak = marked(Weak || '') || undefined,
      move.Miss = marked(Miss || '') || undefined,
      i18nMoves.push(move)
    }
  }
  console.log('  Writing')
  await fs.writeFile('system/assets/moves.json', JSON.stringify(movesJson, null, 2) + '\n')

  // Also write descriptions to en lang file
  const en = JSON.parse(await fs.readFile('system/lang/en.json'))
  for (const move of i18nMoves) {
    en.IRONSWORN.MoveContents ||= {}
    en.IRONSWORN.MoveContents[move.Name] = {
      ...en.IRONSWORN.MoveContents[move.Name],
      title: move.Name,
      description: move.Description,
      strong: move.Strong,
      weak: move.Weak,
      miss: move.Miss,
    }
  }

  // Delve: themes
  console.log('Delve themes:')
  console.log('  Fetching')
  const delveThemesJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_delve_themes.json'
  ).then(x => x.json())

  // TODO: write local version
  // console.log('  Processing')
  // console.log('  Writing')

  // TODO: add text to en.json

  console.log('Delve domains:')
  console.log('  Fetching')
  const delveDomainsJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_delve_domains.json'
  ).then(x => x.json())

  // TODO: write local version
  // console.log('  Processing')
  // console.log('  Writing')

  // TODO: add text to en.json

  console.log('Writing en.json')
  await fs.writeFile('system/lang/en.json', JSON.stringify(en, null, 2) + '\n')
}

doit().then(
  () => process.exit(),
  err => {
    console.error(err)
    process.exit(-1)
  }
)
