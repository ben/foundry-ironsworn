import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import type { AssetDataPropertiesData } from '../item/subtypes/asset'

interface ActorsAndAssets {
	actors: Array<IronswornActor<'character' | 'starship'>>
	assets: Array<IronswornItem<'asset'>>
}

export function actorsOrAssetsWithConditionEnabled(
	condition: string
): ActorsAndAssets {
	const ret: ActorsAndAssets = { actors: [], assets: [] }

	for (const actor of game.actors?.contents ?? []) {
		const actorData = actor.system as any
		if (actorData.debility?.[condition]) {
			ret.actors.push(actor as any)
		}

		for (const item of actor.items.filter((x) => x.type === 'asset')) {
			const assetData = item.system as AssetDataPropertiesData
			if (
				assetData.conditions.find(
					(c) => c.name.toLowerCase() === condition.toLowerCase() && c.ticked
				) != null
			) {
				ret.assets.push(item as any)
			}
		}
	}

	return ret
}
