import type { IronswornActor } from '../actor/actor'
import { ChallengeRank } from '../constants'
import type { IronswornItem } from '../item/item'
import { normalizeTableRows } from './items'
import { IronswornSettings } from './settings.js'
import { capitalize } from './util'

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

// ----------------------------
// Migration 0 (no-op)
async function noop() {
	// no-op
}

// Migration 2: convert vows to progresses with the "vow" subtype
async function everythingIsAProgress() {
	await everyItem(async (x) => {
		if (['progress', 'vow'].includes(x.type)) {
			console.log(`Upgrading ${x.type} ${x.name}`)
			await x.update({
				type: 'progress',
				system: { subtype: x.type }
			})
		}
	})
}

/**
 * Migration 5: Convert challenge ranks from strings to numbers.
 */
async function convertRanksToNumbers() {
	// for Actors this is now managed by ChallengeRankField
	// once item data models are implemented, this can be removed
	function toNumberRank(oldRank: unknown): null | undefined | ChallengeRank {
		// nullish value - return unchanged
		if (oldRank == null) return oldRank

		switch (typeof oldRank) {
			case 'string':
				return (
					ChallengeRank[capitalize(oldRank) as keyof typeof ChallengeRank] ??
					ChallengeRank.Troublesome
				)
			case 'number':
				// already a number - no change required
				return oldRank
			default:
				// something weird -- set a fallback
				return ChallengeRank.Troublesome
		}
	}
	async function updateDoc(doc: any) {
		if (doc.system?.rank != null)
			await doc.update({ system: { rank: toNumberRank(doc.system.rank) } })
	}
	await everyItem(updateDoc)
}

// index 1 is the function to run when upgrading from 1 to 2, and so on
const MIGRATIONS: Array<() => Promise<any>> = [
	noop,
	noop, // Migration 1: "formidible" -> "formidable"; now handled by data model
	everythingIsAProgress,
	noop, // Migration 3: Cast any string values that should be numbers; now handled by data model
	noop, // Migration 4: Transform delve features, dangers, and denizens into a TableResult-like format; now handled by data model
	convertRanksToNumbers
]
const NEWEST_VERSION = MIGRATIONS.length

export async function runDataMigrations() {
	// Bail if this user isn't capable of running the migrations
	if (!game.user?.isGM) return

	// Bail if we're already at the newest version
	let currentVersion = IronswornSettings.get('data-version')
	if (currentVersion >= NEWEST_VERSION) return

	const showWarnings = currentVersion > 1 // Don't show these for a brand-new world

	try {
		if (showWarnings) {
			ui.notifications?.warn('Doing some system housecleaning, please wait...')
		}

		while (currentVersion < NEWEST_VERSION) {
			await MIGRATIONS[currentVersion]()
			currentVersion++
		}

		// All done
		game.settings.set('foundry-ironsworn', 'data-version', NEWEST_VERSION)
		if (showWarnings) {
			ui.notifications?.warn('All done! Carry on.')
		}
	} catch (e) {
		ui.notifications?.error(
			'Well crap, data migration ran into a problem. Try reloading your browser to run it again.',
			{
				permanent: true
			}
		)
	}
}
