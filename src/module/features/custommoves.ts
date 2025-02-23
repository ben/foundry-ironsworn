import {
	COMPENDIUM_KEY_MAP,
	DataswornTree,
	getPackAndIndexForCompendiumKey
} from '../datasworn2'
import { DataswornRulesetKey, IronswornSettings } from '../helpers/settings'
import type { Move, MoveCategory } from '@datasworn/core/dist/Datasworn'
import { moveTriggerIsRollable } from '../rolls/preroll-dialog'
import { compact } from 'lodash-es'
import { IronswornItem } from '../item/item'
import { SFMoveModel } from '../item/subtypes/sfmove'

interface DisplayMoveRuleset {
	displayName: string
	categories: DisplayMoveCategory[]
}

export interface DisplayMoveCategory {
	color: string | null
	displayName: string
	moves: DisplayMove[]
	ds?: MoveCategory
}

export interface DisplayMove {
	color: string | null
	displayName: string
	uuid: string
	triggerText?: string
	isRollable: boolean
	oracles: string[]
	ds?: Move
}

const INDEXES: Record<string, any> = {}
async function ensureIndex(rsKey: DataswornRulesetKey) {
	const compendiumKey = COMPENDIUM_KEY_MAP.move[rsKey]
	if (INDEXES[compendiumKey] == null) {
		const { index } = await getPackAndIndexForCompendiumKey(rsKey, 'move', [
			'system.Trigger',
			'system.dsOracleIds'
		])
		INDEXES[compendiumKey] = index
	}
}

export async function createMoveTreeForRuleset(
	rsKey: DataswornRulesetKey
): Promise<DisplayMoveRuleset> {
	await ensureIndex(rsKey)
	const rs = DataswornTree.get(rsKey)
	const index = INDEXES[COMPENDIUM_KEY_MAP.move[rsKey]]
	const categories = Object.values(rs?.moves ?? {})
	return {
		displayName: game.i18n.localize(`IRONSWORN.RULESETS.${rsKey}`),
		categories: categories.map((cat) => ({
			color: cat.color ?? MoveCategoryColor[cat.name] ?? null,
			displayName: game.i18n.localize(`IRONSWORN.MOVES.${cat.name}`),
			ds: cat,
			moves: Object.values(cat.contents).map((move) => {
				const indexEntry = index.contents.find(
					(x) => x.flags['foundry-ironsworn']?.dsid === move._id
				)
				return {
					color: move.color ?? null,
					displayName: indexEntry.name,
					uuid: indexEntry.uuid, // TODO: move.uuid
					triggerText: indexEntry.system?.Trigger?.Text,
					isRollable: moveTriggerIsRollable(indexEntry?.system?.Trigger),
					oracles: indexEntry.system?.dsOracleIds ?? [],
					ds: move
				}
			})
		}))
	}
}

function customFolderMoveCategory(): DisplayMoveRuleset | undefined {
	const name = game.i18n.localize('IRONSWORN.MOVES.Custom Moves')
	const rootFolder = game.items?.folders.find((x) => x.name === name)
	if (!rootFolder) return undefined

	const category: DisplayMoveCategory = {
		displayName: name,
		color: (rootFolder as any).color?.css ?? null,
		moves: []
	}

	for (const item of rootFolder.contents) {
		if (!(item instanceof IronswornItem)) continue
		if (item.type !== 'sfmove') continue
		const system = item.system as SFMoveModel

		category.moves.push({
			displayName: item.name ?? '(unnamed)',
			uuid: item.uuid,
			color: null,
			isRollable: moveTriggerIsRollable(system.Trigger),
			oracles: system.dsOracleIds ?? [],
			triggerText: system.Trigger?.Text
		})
	}
	if (category.moves.length === 0) return undefined

	return {
		displayName: name,
		categories: [category]
	}
}

export async function createMergedMoveTree(): Promise<DisplayMoveRuleset[]> {
	// Pre-load compendium indexes
	await Promise.all(IronswornSettings.enabledRulesets.map(ensureIndex))
	return compact([
		...(await Promise.all(
			IronswornSettings.enabledRulesets.map(createMoveTreeForRuleset)
		)),
		customFolderMoveCategory()
	])
}

// TODO dataforged has a key for move colours...., but they appear to have changed significantly since the last time i updated them! they'll be fixed for 2.0, but until then, here's a workaround.
export enum MoveCategoryColor {
	'Adventure Moves' = '#206087',
	'Combat Moves' = '#818992',
	'Connection Moves' = '#4A5791',
	// non-canonical (ironsworn); uses color from 'Exploration'
	'Delve Moves' = '#427FAA',
	'Exploration Moves' = '#427FAA',
	// non-canonical (ironsworn); uses color from 'Legacy'.
	'Failure Moves' = '#4F5A69',
	'Fate Moves' = '#8F477B',
	'Legacy Moves' = '#4F5A69',
	'Quest Moves' = '#805A90',
	// non-canonical (ironsworn); uses color from 'Recover'
	'Rarity Moves' = '#488B44',
	'Recover Moves' = '#488B44',
	// non-canonical (ironsworn); uses color from 'Connection'
	'Relationship Moves' = '#4A5791',
	'Scene Challenge' = '#206087',
	'Session Moves' = '#3F8C8A',
	'Suffer Moves' = '#883529',
	// non-canonical (ironsworn); uses color from 'Session'
	'Threat Moves' = '#3F8C8A',
	'Threshold Moves' = '#1D1D1B'
}
