export function capitalize(txt: string) {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
}

function dfTreeSearch(node: any, id: string) {
  if (node.$id === id) return node
  const children = [...(node.Oracles ?? []), ...(node.Categories ?? [])]
  for (const child of children) {
    const ret = dfTreeSearch(child, id)
    if (ret) return ret
  }
  return undefined
}

export async function sfOracleJsonByDataforgedId(dataforgedId: string): Promise<Record<string, any> | undefined> {
  // Load the json
  const json = await fetch('systems/foundry-ironsworn/assets/sf-oracles.json').then((x) => x.json())

  // Search for the thing
  return dfTreeSearch({ Oracles: json }, dataforgedId)
}

export async function sfOracleByDataforgedId(dataforgedId: string): Promise<RollTable | undefined> {
  // Find the DF oracle by ID
  const idMap = await fetch('systems/foundry-ironsworn/assets/sf-ids.json').then((x) => x.json())
  const documentId = idMap[dataforgedId]
  if (!documentId) return undefined

  // Look it up in the pack
  const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
  await pack?.getDocuments()
  return pack?.get(documentId)
}
