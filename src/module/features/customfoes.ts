import { Npc, NpcCollection } from '@datasworn/core/dist/Datasworn'
import {
	DataswornTree,
	FoundryIndex,
	getPackAndIndexForCompendiumKey
} from '../datasworn2'
import { IronswornSettings } from '../helpers/settings'

interface DisplayFoe {
	displayName: string
	uuid: string
	ds?: Npc
}

interface DisplayFoeCategory {
	displayName: string
	foes: DisplayFoe[]
	ds?: NpcCollection
	expanded: boolean
}

interface DisplayFoeRuleset {
	displayName: string
	index?: FoundryIndex
	categories: DisplayFoeCategory[]
}

export async function createFoeTree(): Promise<DisplayFoeRuleset[]> {
	return await Promise.all(
		IronswornSettings.enabledRulesets.map(async (rskey) => {
			const { index } = await getPackAndIndexForCompendiumKey(rskey, 'npc')
			const rs = DataswornTree.get(rskey)

			return {
				displayName: game.i18n.localize(`IRONSWORN.RULESETS.${rskey}`),
				index,
				categories: Object.values(rs?.npcs ?? {}).map((cat) => ({
					displayName: cat.name, // TODO: game.i18n.localize(`IRONSWORN.FOES.${cat.name}`)
					expanded: false,
					foes: Object.values(cat.contents).map((foe) => {
						const indexEntry = index?.contents?.find(
							(x) => x.flags['foundry-ironsworn']?.dsid === foe._id
						)
						return {
							displayName: foe.name,
							uuid: indexEntry?.uuid ?? '',
							ds: foe
						}
					})
				}))
			}
		})
	)
}
