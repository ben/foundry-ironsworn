import { Npc, NpcCollection } from '@datasworn/core/dist/Datasworn'
import { compact, flatten } from 'lodash-es'
import {
	DataswornTree,
	FoundryIndex,
	getPackAndIndexForCompendiumKey
} from '../datasworn2'
import { IronswornSettings } from '../helpers/settings'

export interface DisplayFoe {
	displayName: string
	uuid: string
	img: string
	isVariant: boolean
	nature?: string
	ds?: Npc
}

interface DisplayFoeCategory {
	displayName: string
	description: string
	foes: DisplayFoe[]
	ds?: NpcCollection
	expanded?: boolean
}

interface DisplayFoeRuleset {
	displayName: string
	categories: DisplayFoeCategory[]
}

function displayFoesForNpc(index: FoundryIndex, npc: Npc): DisplayFoe[] {
	const indexEntry = index.contents.find(
		(x) => x.flags['foundry-ironsworn']?.dsid === npc._id
	)
	if (!indexEntry) return []

	const ret = [
		{
			displayName: indexEntry.name,
			uuid: indexEntry?.uuid ?? '',
			img: indexEntry?.img ?? '',
			isVariant: false,
			nature: npc.nature,
			ds: npc
		}
	]

	for (const variant of Object.values(npc.variants)) {
		const indexEntry = index.contents.find(
			(x) => x.flags['foundry-ironsworn']?.dsid === variant._id
		)

		ret.push({
			displayName: indexEntry?.name ?? variant.name,
			uuid: indexEntry?.uuid ?? '',
			img: indexEntry?.img ?? '',
			isVariant: true,
			nature: variant.nature,
			ds: npc
		})
	}

	return ret
}

export async function createFoeTree(): Promise<DisplayFoeRuleset[]> {
	return compact(
		await Promise.all(
			IronswornSettings.enabledRulesets.map(async (rskey) => {
				const rs = DataswornTree.get(rskey)
				if (!rs) throw new Error('No ruleset for ' + rskey)

				const { index } = await getPackAndIndexForCompendiumKey(rskey, 'npc')
				if (!index) {
					console.log(`No index for ${rskey}, skipping`)
					return undefined
				}

				return {
					displayName: game.i18n.localize(`IRONSWORN.RULESETS.${rskey}`),
					categories: Object.values(rs?.npcs ?? {}).map((cat) => ({
						displayName: game.i18n.localize(
							`IRONSWORN.NpcCategories.${cat.name}.Name`
						),
						description: game.i18n.localize(
							`IRONSWORN.NpcCategories.${cat.name}.Description`
						),
						foes: flatten(
							Object.values(cat.contents).map((n) =>
								displayFoesForNpc(index, n)
							)
						)
					}))
				}
			})
		)
	)
}
