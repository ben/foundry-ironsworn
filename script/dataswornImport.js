const { markdown } = require('markdown')
const fetch = require('node-fetch')
const fs = require('fs/promises')
const util = require('util')

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
          let description = x.Name ? `**${x.Name}:** ${x.Text}` : x.Text
          description = description.replace(
            /(roll )?\+(iron|edge|wits|shadow|heart|health|spirit|supply)/g,
            '((rollplus $2))'
          )
          return {
            enabled: x.Enabled || false,
            description: markdown.toHTML(description)
          }
        }),
        health: asset.Health
          ? { current: asset.Health, max: asset.Health }
          : undefined
      }
    })
  }
  await fs.writeFile('assets/assets.json', JSON.stringify(assets, null, 2))
}

doit().then(
  () => process.exit(),
  err => {
    console.error(err)
    process.exit(-1)
  }
)
