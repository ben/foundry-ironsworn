import { isEmpty } from 'lodash'
import { IronswornActor } from '../actor/actor'
import { IronswornActorData } from '../actor/actortypes'
import { IronswornSettings } from './settings'

const CURRENT_DATA_VERSION = 1

export async function maybeMigrateData() {
  if (IronswornSettings.dataVersion >= CURRENT_DATA_VERSION) {
    return
  }

  for (const a of (game.actors as any)?.contents as IronswornActor[]) {
    try {
      const updatedData = migrateActorData(a.data)
      if (!isEmpty(updatedData)) {
        console.log(`Migrating actor ${a.name} (${a.id})`)
        await a.update(updatedData, { enforceTypes: false })
      }
    } catch (err) {
      err.message = `Failed dnd5e system migration for Actor ${a.name}: ${err.message}`
      console.error(err)
    }
  }
}

function migrateActorData(_data: IronswornActorData): { [key: string]: string | number } {
  const ret = {}

  return ret
}
