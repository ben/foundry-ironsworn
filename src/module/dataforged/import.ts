import type { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type {
	IAssetType,
	IMoveCategory,
	IOracle,
	IOracleCategory,
	Ironsworn,
	ISettingTruth,
	Starforged
} from 'dataforged'
import { ironsworn, starforged } from 'dataforged'
import { isArray, isObject, max } from 'lodash-es'
import { marked } from 'marked'
import shajs from 'sha.js'
import { renderLinksInMove, renderLinksInStr } from '.'
import { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import { IronswornJournalEntry } from '../journal/journal-entry'
import { IronswornJournalPage } from '../journal/journal-entry-page'
import {
	ISAssetTypes,
	ISMoveCategories,
	ISOracleCategories,
	SFAssetTypes,
	SFMoveCategories,
	SFOracleCategories
} from './data'
import { DATAFORGED_ICON_MAP } from './images'
import { renderMarkdown } from './rendering'

export function cleanDollars(obj): any {
	if (isArray(obj)) {
		const ret = [] as any[]
		for (const item of obj) {
			ret.push(cleanDollars(item))
		}
		return ret
	} else if (isObject(obj)) {
		const ret = {} as any
		for (const k of Object.keys(obj)) {
			let newK = k
			if (newK.startsWith('$')) {
				newK = 'df' + k.substring(1)
			}
			ret[newK] = cleanDollars(obj[k])
		}
		return ret
	}
	return obj
}

const HASH_CACHE = {} as Record<string, string>
export function hashLookup(str: string): string {
	HASH_CACHE[str] ||= hash(str)
	return HASH_CACHE[str]
}

export function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

const PACKS = [
	'foundry-ironsworn.starforgedassets',
	'foundry-ironsworn.starforgedencounters',
	'foundry-ironsworn.starforgedmoves',
	'foundry-ironsworn.starforgedoracles',
	'foundry-ironsworn.starforgedtruths',
	'foundry-ironsworn.foeactorssf',
	'foundry-ironsworn.ironswornassets',
	'foundry-ironsworn.ironswornoracles',
	'foundry-ironsworn.ironswornmoves',
	'foundry-ironsworn.ironsworntruths'
]

/**
 * Converts JSON from dataforged resources into foundry packs. Requires packs to
 * already exist, but will empty them prior to repopulating. In a perfect world
 * we would retain dataforged's $id as Foundry's _id, but Foundry validates that
 * those fields meet with its UID expectations (/[a-zA-Z0-9]{16}/)
 */
export async function importFromDataforged() {
	// Empty out the packs
	for (const key of PACKS) {
		const pack = game.packs.get(key)
		if (pack == null) continue

		// Unlock all the packs
		await pack.configure({ locked: false })

		// Delete all the contents
		const idsToDelete = pack.index.map((x) => x._id)
		await Item.deleteDocuments(idsToDelete, { pack: key })
	}

	await processSFMoves()
	await processSFAssets()
	await processISAssets()
	await processSFOracles()
	await processSFEncounters()
	await processSFFoes()

	await processISMoves()
	await processISOracles()

	// await processISTruths() // Re-enable when DF includes them
	await processSFTruths()

	// Lock the packs again
	for (const key of PACKS) {
		await game.packs.get(key)?.configure({ locked: true })
	}
}

/**
 * MOVES
 */

function movesForCategories(
	categories: IMoveCategory[]
): Array<ItemDataConstructorData & Record<string, unknown>> {
	const movesToCreate = [] as Array<
		ItemDataConstructorData & Record<string, unknown>
	>
	for (const category of categories) {
		for (const move of category.Moves) {
			renderLinksInMove(move)
			const cleanMove = cleanDollars(move)

			// Patch one or two missing things in Dataforged
			if (move.$id === 'Ironsworn/Moves/Delve/Find_an_Opportunity') {
				move.Oracles = ['Ironsworn/Oracles/Moves/Find_an_Opportunity']
			}

			console.log(move.Name, move.$id)
			movesToCreate.push({
				_id: hashLookup(cleanMove.dfid),
				type: 'sfmove',
				name: move.Name,
				img: 'icons/dice/d10black.svg',
				system: cleanMove
			})
		}
	}
	return movesToCreate
}

async function processISMoves() {
	const movesToCreate = movesForCategories(ISMoveCategories)
	await Item.createDocuments(movesToCreate, {
		pack: 'foundry-ironsworn.ironswornmoves',
		keepId: true
	})
}
async function processSFMoves() {
	const movesToCreate = movesForCategories(SFMoveCategories)
	await Item.createDocuments(movesToCreate, {
		pack: 'foundry-ironsworn.starforgedmoves',
		keepId: true
	})
}

/**
 * ASSSETS
 */

function assetsForTypes(types: IAssetType[]) {
	const assetsToCreate = [] as Array<
		ItemDataConstructorData & Record<string, unknown>
	>
	for (const assetType of types) {
		for (const asset of assetType.Assets) {
			// Inputs map to fields and exclusive options
			const fields = [] as Array<{ name: string; value: string }>
			const exclusiveOptions = [] as Array<{ name: string; selected: boolean }>
			// TODO: "Number"
			for (const input of asset.Inputs ?? []) {
				if (input['Input Type'] === 'Text') {
					fields.push({ name: input.Name, value: '' })
				}
				if (input['Input Type'] === 'Select') {
					for (const option of input.Options) {
						exclusiveOptions.push({ name: option.Name, selected: false })
					}
				}
			}

			const data = {
				requirement: renderMarkdown(asset.Requirement ?? ''),
				category: assetType.Name,
				color: assetType.Display.Color ?? '',
				fields,
				abilities: (asset.Abilities ?? []).map((ability) => {
					const ret = {
						enabled: ability.Enabled || false,
						description: renderMarkdown(ability.Text)
					} as any

					for (const input of ability.Inputs ?? []) {
						if (input['Input Type'] === 'Clock') {
							const ic = input
							ret.hasClock = true
							ret.clockMax = ic.Segments
							ret.clockTicks = ic.Filled
						}
					}

					return ret
				}),
				track: {
					enabled: !(asset['Condition Meter'] == null),
					name: asset['Condition Meter']?.Name,
					current: asset['Condition Meter']?.Value,
					max: asset['Condition Meter']?.Max
				},
				exclusiveOptions,
				conditions: (asset['Condition Meter']?.Conditions ?? []).map(
					(name) => ({ name, selected: false })
				)
			}
			assetsToCreate.push({
				type: 'asset',
				_id: hashLookup(asset.$id),
				name: asset.Name,
				system: data
			})
		}
	}
	return assetsToCreate
}

async function processSFAssets() {
	const assetsToCreate = assetsForTypes(SFAssetTypes)
	await Item.createDocuments(assetsToCreate, {
		pack: 'foundry-ironsworn.starforgedassets',
		keepId: true
	})
}

async function processISAssets() {
	const assetsToCreate = assetsForTypes(ISAssetTypes)
	await Item.createDocuments(assetsToCreate, {
		pack: 'foundry-ironsworn.ironswornassets',
		keepId: true
	})
}

/**
 * ORACLES
 */
async function processOracle(
	oracle: IOracle,
	output: RollTableDataConstructorData[]
) {
	// Oracles JSON is a tree we wish to iterate through depth first adding
	// parents prior to their children, and children in order
	if (oracle.Table != null) {
		const description = marked.parseInline(
			renderLinksInStr(oracle.Description ?? '')
		)
		const maxRoll = max(oracle.Table.map((x) => x.Ceiling ?? 0)) // oracle.Table && maxBy(oracle.Table, (x) => x.Ceiling)?.Ceiling
		output.push({
			_id: hashLookup(oracle.$id),
			flags: {
				'foundry-ironsworn': { dfid: oracle.$id, category: oracle.Category }
			},
			name: oracle.Name,
			img: 'icons/dice/d10black.svg',
			description,
			formula: `d${maxRoll as number}`,
			replacement: true,
			displayRoll: true,
			/* folder: // would require using an additional module */
			results: oracle.Table?.map((tableRow) => {
				let text: string
				if (tableRow.Result && tableRow.Summary) {
					text = `${tableRow.Result} (${tableRow.Summary})`
				} else text = tableRow.Result ?? ''
				return {
					_id: hashLookup(tableRow.$id ?? ''),
					range: [tableRow.Floor, tableRow.Ceiling],
					text: tableRow.Result && renderLinksInStr(text)
				} as TableResultDataConstructorData
			}).filter((x) => x.range[0] !== null)
		})
	}

	for (const child of oracle.Oracles ?? []) await processOracle(child, output)
}
async function processOracleCategory(
	cat: IOracleCategory,
	output: RollTableDataConstructorData[]
) {
	for (const oracle of cat.Oracles ?? []) await processOracle(oracle, output)
	for (const child of cat.Categories ?? [])
		await processOracleCategory(child, output)
}

async function processSFOracles() {
	const oraclesToCreate: RollTableDataConstructorData[] = []

	for (const category of SFOracleCategories) {
		await processOracleCategory(category, oraclesToCreate)
	}
	await RollTable.createDocuments(oraclesToCreate, {
		pack: 'foundry-ironsworn.starforgedoracles',
		keepId: true
	})
}

async function processISOracles() {
	const oraclesToCreate: RollTableDataConstructorData[] = []

	for (const category of ISOracleCategories) {
		await processOracleCategory(category, oraclesToCreate)
	}
	await RollTable.createDocuments(oraclesToCreate, {
		pack: 'foundry-ironsworn.ironswornoracles',
		keepId: true
	})
}

async function processSFEncounters() {
	const encountersToCreate = [] as Array<
		ItemDataConstructorData & Record<string, unknown>
	>
	for (const encounter of starforged.Encounters) {
		const description = await renderTemplate(
			'systems/foundry-ironsworn/templates/item/sf-foe.hbs',
			{
				...encounter,
				variantLinks: encounter.Variants.map((x) =>
					renderLinksInStr(`[${x.Name}](${x.$id})`)
				)
			}
		)

		encountersToCreate.push({
			_id: hashLookup(encounter.$id),
			type: 'progress',
			name: encounter.Name,
			img: DATAFORGED_ICON_MAP.starforged.foe[encounter.$id],
			system: {
				description,
				rank: encounter.Rank
			}
		})

		for (const variant of encounter.Variants) {
			const variantDescription = await renderTemplate(
				'systems/foundry-ironsworn/templates/item/sf-foe.hbs',
				{
					...encounter,
					...variant,
					Category: variant.Nature ?? encounter.Nature,
					CategoryDescription: (variant as any).Summary ?? encounter.Summary
				}
			)

			encountersToCreate.push({
				_id: hashLookup(variant.$id),
				type: 'progress',
				name: variant.Name,
				img: DATAFORGED_ICON_MAP.starforged.foe[variant.$id],
				system: {
					description: variantDescription,
					rank: variant.Rank ?? encounter.Rank
				}
			})
		}
	}
	await Item.createDocuments(encountersToCreate, {
		pack: 'foundry-ironsworn.starforgedencounters',
		keepId: true
	})
}

async function processSFFoes() {
	const foesPack = game.packs.get('foundry-ironsworn.starforgedencounters')
	const foeItems = (await foesPack?.getDocuments()) as Array<
		StoredDocument<IronswornItem>
	>
	for (const foeItem of foeItems ?? []) {
		const actor = await IronswornActor.create(
			{
				name: foeItem.name ?? 'wups',
				img: foeItem.img,
				type: 'foe'
			},
			{ pack: 'foundry-ironsworn.foeactorssf' }
		)
		await actor?.createEmbeddedDocuments('Item', [
			{
				name: foeItem.name ?? 'wups',
				type: 'progress',
				system: foeItem.system as unknown as Record<string, unknown>
			}
		])
	}
}

async function processTruths(
	truths: ISettingTruth[],
	outputCompendium: string
) {
	const pack = game.packs.get(outputCompendium)
	if (pack == null) throw new Error(`Couldn't find ${outputCompendium}`)

	for (const truth of truths) {
		const je = await IronswornJournalEntry.create(
			{
				name: truth.Display.Title,
				flags: { 'foundry-ironsworn': { dfid: truth.$id } }
			},
			{ pack: outputCompendium }
		)

		for (const entry of truth.Table) {
			await IronswornJournalPage.create(
				{
					type: 'truth',
					name: entry.Result,
					system: cleanDollars({
						Subtable: [], // work around a Foundry bug
						...entry,
						Quest: entry['Quest Starter'],
						'Quest Starter': undefined
					})
				},
				{ parent: je }
			)
		}

		await IronswornJournalPage.create(
			{
				name: 'Character Inspiration',
				text: {
					markdown: truth.Character,
					format: 2 // JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN
				},
				flags: {
					'foundry-ironsworn': {
						assets: truth.Suggestions?.Assets ?? []
					}
				}
			},
			{ parent: je }
		)
	}
}

async function processSFTruths() {
	await processTruths(
		((starforged as any).default as Starforged)['Setting Truths'],
		'foundry-ironsworn.starforgedtruths'
	)
}
async function processISTruths() {
	await processTruths(
		((ironsworn as any).default as Ironsworn)['Setting Truths']!,
		'foundry-ironsworn.starforgedtruths'
	)
}
