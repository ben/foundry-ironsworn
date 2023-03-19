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

// Migration 1: "formidible" -> "formidable"
async function fixFormidableSpelling() {
	// Iterate through everything that has a rank (sites, items, owned items), and change "formidible" to "formidable"
	await everyItem(async (x) => {
		if ((x?.data?.data as any).rank === 'formidible') {
			console.log(`Upgrading ${x.type} / ${x.name}`)
			await x.update({ system: { rank: 'formidable' } })
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
				system: { subtype: x.type }
			})
		}
	})
}

// Migration 3: Cast any string values that should be numbers
async function statsAreAlwaysNumbers() {
	await everyActor(async (actor) => {
		if (actor.type !== 'character') return
		const statKeys = [
			'edge',
			'heart',
			'iron',
			'shadow',
			'wits',
			'health',
			'spirit',
			'supply'
		]
		const update = {}
		for (const k of statKeys) {
			update[k] = parseInt(actor.data.data[k] || '0', 10)
		}
		await actor.update({ system: update })
	})
}

/**
 * Migration 4:
 * Transform site denizens, site features, and site dangers into a {@link TableResult}-like format.
 */
async function normalizeDelveTableRows() {
	await everyActor(async (actor) => {
		const typeToMigrate = 'site'
		const keyToMigrate = 'system.denizens'
		if ((actor.type as any) === 'site') {
			const denizens = normalizeTableRows(actor, keyToMigrate, typeToMigrate)
			await actor.update({
				system: { denizens },
				type: 'site'
			})
		}
	})
	await everyItem(async (item) => {
		const typesToMigrate = ['delve-domain', 'delve-theme'] as Array<
			SourceConfig['Item']['type']
		>
		const keysToMigrate = ['system.features', 'system.dangers']
		if (typesToMigrate.includes(item.type)) {
			keysToMigrate.forEach((key) => {
				item.update({
					[key]: normalizeTableRows(item, key, item.type)
				})
			})
		}
	})
}

/**
 * Migration 5: Convert challenge ranks from strings to numbers.
 */
async function convertRanksToNumbers() {
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
	await everyActor(async (actor: any) => {
		if (actor.system.rank != null)
			await actor.update({ system: { rank: toNumberRank(actor.system.rank) } })
	})
	await everyItem(async (item: any) => {
		if (item.system.rank != null)
			await item.update({ system: { rank: toNumberRank(item.system.rank) } })
	})
}

// index 1 is the function to run when upgrading from 1 to 2, and so on
const MIGRATIONS: Array<() => Promise<any>> = [
	noop,
	fixFormidableSpelling,
	everythingIsAProgress,
	statsAreAlwaysNumbers,
	normalizeDelveTableRows,
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
