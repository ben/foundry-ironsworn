import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'

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
      // TODO: check asset conditions when they start to exist
    }
  }

  return ret
}
