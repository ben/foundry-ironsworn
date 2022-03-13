export function capitalize(txt: string) {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
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
