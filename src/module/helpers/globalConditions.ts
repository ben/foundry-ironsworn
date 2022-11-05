import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import { AssetDataProperties } from '../item/itemtypes'

interface ActorsAndAssets {
  actors: IronswornActor[]
  assets: IronswornItem[]
}

export function actorsOrAssetsWithConditionEnabled(
  condition: string
): ActorsAndAssets {
  const ret: ActorsAndAssets = { actors: [], assets: [] }

  for (const actor of game.actors?.contents ?? []) {
    const actorData = actor.data.data as any
    if (actorData.debility?.[condition]) {
      ret.actors.push(actor)
    }

    for (const item of actor.items.filter((x) => x.type === 'asset')) {
      const assetData = item.data as AssetDataProperties
      if (
        assetData.data.conditions.find(
          (c) => c.name.toLowerCase() === condition.toLowerCase() && c.ticked
        )
      ) {
        ret.assets.push(item)
      }
    }
  }

  return ret
}
