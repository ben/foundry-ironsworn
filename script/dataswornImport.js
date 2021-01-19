const { markdown } = require('markdown')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const util = require('util')

function renderHtml (text) {
  return markdown.toHTML(
    text.replace(
      /(roll )?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/g,
      '((rollplus $2))'
    )
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
    assets.push({
      name: `${asset['Asset Type']} / ${assetName}`,
      data: {
        description: asset.Description,
        fields: asset['Input Fields']?.map(x => ({ name: x, value: '' })),
        abilities: asset.Abilities.map(x => {
          const description = x.Name ? `**${x.Name}:** ${x.Text}` : x.Text
          return {
            enabled: x.Enabled || false,
            description: renderHtml(description)
          }
        }),
        health: asset.Health
          ? { current: asset.Health, max: asset.Health }
          : undefined
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
