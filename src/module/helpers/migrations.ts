import { IronswornActor } from "../actor/actor"
import { IronswornItem } from "../item/item"

function noop() {
  // no-op
}

async function fixFormidableSpelling() {
  // Iterate through everything that has a rank (sites, items, owned items), and change "formidible" to "formidable"
  const setRank = async (x: IronswornActor | IronswornItem) => {
    if ((x?.data?.data as any).rank === 'formidible') {
      console.log(`Upgrading ${x.type} / ${x.name}`)
      await x.update({data: {rank: 'formidable'}})
    }
  }
  for (const item of game.items?.contents || []) {
    await setRank(item)
  }
  for (const actor of game.actors?.contents || []) {
    await setRank(actor)
    for (const item of actor.items) {
      await setRank(item)
    }
  }
  for (const pack of game.packs.contents) {
    for (const thing of pack.contents) {
      await setRank(thing as any)
    }
  }
}

// index 1 is the function to run when upgrading from 1 to 2, and so on
const MIGRATIONS = [
  noop,
  fixFormidableSpelling
]
const NEWEST_VERSION = MIGRATIONS.length

export async function runDataMigrations() {
  // Bail if this user isn't capable of running the migrations
  if (!game.user?.isGM) return

  // Bail if we're already at the newest version
  let currentVersion = game.settings.get('foundry-ironsworn', 'data-version') as number
  if (currentVersion >= NEWEST_VERSION) return

  try {
    ui.notifications?.warn('Doing some system housecleaning, please wait...', { permanent: true })

    while (currentVersion < NEWEST_VERSION) {
      await MIGRATIONS[currentVersion]()
      currentVersion++
    }

    // All done
    game.settings.set('foundry-ironsworn', 'data-version', NEWEST_VERSION)
    ui.notifications?.warn('All done! Carry on.', { permanent: true })
  } catch (e) {
    ui.notifications?.error("Whoops! That didn't work at all. Try reloading your browser to run it again.", { permanent: true })
  }
}
