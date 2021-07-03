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
  const assetsJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_assets.json'
  ).then(x => x.json())
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
      }
    })
  }
  await fs.writeFile('system/assets/assets.json', JSON.stringify(assets, null, 2))

  // Moves
  const movesJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_moves.json'
  ).then(x => x.json())
  const moves = []
  for (const category of movesJson.Categories) {
    for (const move of category.Moves) {
      let [_, description, strong, weak, miss] = move.Text.match(
        /([\s\S]+)(On a \*\*strong hit\*\*, [\s\S]+)(On a \*\*weak hit\*\*, [\s\S]+)(On a \*\*miss\*\*, [\s\S]+)/
      ) || []
      if (!description) description = move.Text
      moves.push({
        name: move.Name,
        data: {
          source: {
            name: move.Source.Name,
            page: move.Source.Page,
          },
          stats: move.Stats,
          description: marked(description || ''),
          strong: marked(strong || '') || undefined,
          weak: marked(weak || '') || undefined,
          miss: marked(miss || '') || undefined,
        },
      })
    }
  }
  await fs.writeFile('system/assets/moves.json', JSON.stringify(moves, null, 2))

  // Also write descriptions to en lang file
  const en = JSON.parse(await fs.readFile('system/lang/en.json'))
  for (const move of moves) {
    en['IRONSWORN']['MoveContents'] ||= {}
    en['IRONSWORN']['MoveContents'][move.name] = {
      ...en['IRONSWORN']['MoveContents'][move.name],
      title: move.name,
      description: move.data.description,
      strong: move.data.strong,
      weak: move.data.weak,
      miss: move.data.miss,
    }
  }
  await fs.writeFile('system/lang/en.json', JSON.stringify(en, null, 2))
}

doit().then(
  () => process.exit(),
  err => {
    console.error(err)
    process.exit(-1)
  }
)
