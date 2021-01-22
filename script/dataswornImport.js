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
  for (const assetName of Object.keys(assetsJson.Assets)) {
    const asset = assetsJson.Assets[assetName]

    const track = {
      enabled: false,
      name: '',
      max: 0,
      current: 0
    }
    if (asset.Health) {
      track.enabled = true
      track.name = 'Health'
      track.max = track.current = asset.Health
    }
    if (asset['Asset Track']) {
      track.enabled = true
      track.name = asset['Asset Track'].Name
      track.max = asset['Asset Track'].Max
      track.current = asset['Asset Track']['Starting Value']
    }

    assets.push({
      name: `${asset['Asset Type']} / ${assetName}`,
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
  await fs.writeFile('assets/assets.json', JSON.stringify(assets, null, 2))

  // Moves
  const movesJson = await fetch(
    'https://raw.githubusercontent.com/rsek/datasworn/master/ironsworn_moves.json'
  ).then(x => x.json())
  const moves = []
  for (const category of Object.values(movesJson.Moves)) {
    for (const moveName of Object.keys(category)) {
      moves.push({
        name: moveName,
        data: { description: renderHtml(category[moveName].Text) }
      })
    }
  }
  await fs.writeFile('assets/moves.json', JSON.stringify(moves, null, 2))
}

doit().then(
  () => process.exit(),
  err => {
    console.error(err)
    process.exit(-1)
  }
)
