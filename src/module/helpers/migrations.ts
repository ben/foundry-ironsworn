import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'

// Utilities
async function everyActor(fn: (a: IronswornActor) => any) {
  // Game actors
  for (const actor of game.actors?.contents ?? []) {
    await fn(actor)
  }

  // Pack actors
  for (const pack of game.packs.contents) {
    if (pack.documentClass === Actor) {
      for (const thing of pack.contents) {
        await fn(thing as IronswornActor)
      }
    }
  }
}
async function everyItem(fn: (x: IronswornItem) => any) {
  // Items
  for (const item of game.items?.contents ?? []) {
    await fn(item)
  }

  // Pack items
  for (const pack of game.packs.contents) {
    if (pack.documentClass === Item) {
      for (const thing of pack.contents) {
        await fn(thing as IronswornItem)
      }
    }
  }

  // Actor-owned items (includes packs)
  await everyActor(async (a) => {
    for (const item of a.items.contents) {
      await fn(item)
    }
  })
}

//----------------------------
// Migration 0 (no-op)
async function noop() {
  // no-op
}

// Migration 1: "formidible" -> "formidable"
async function fixFormidableSpelling() {
  // Iterate through everything that has a rank (sites, items, owned items), and change "formidible" to "formidable"
  await everyItem(async (x) => {
    if ((x?.data?.data as any).rank === 'formidible') {
      console.log(`Upgrading ${x.type} / ${x.name}`)
      await x.update({ data: { rank: 'formidable' } })
    }
  })
}

// Migration 2: convert vows to progresses with the "vow" subtype
async function everythingIsAProgress() {
  await everyItem(async (x) => {
    if (['progress', 'vow'].includes(x.type)) {
      console.log(`Upgrading ${x.type} ${x.name}`)
      await x.update({
        type: 'progress',
        data: { subtype: x.type },
      })
    }
  })
}

// index 1 is the function to run when upgrading from 1 to 2, and so on
const MIGRATIONS: Array<() => Promise<any>> = [noop, fixFormidableSpelling, everythingIsAProgress]
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
