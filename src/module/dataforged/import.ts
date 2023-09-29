import type { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData'
import type { RollTableDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type {
	IAssetType,
	IMoveCategory,
	IOracle,
	IOracleCategory,
	Ironsworn,
	ISettingTruth,
	Starforged
} from 'dataforged'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { starforged, ironsworn } from 'dataforged'
import { isArray, isObject } from 'lodash-es'
import shajs from 'sha.js'
import { renderLinksInMove, renderLinksInStr } from '.'
import { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import { OracleTable } from '../roll-table/oracle-table'
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
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import { MoveCategoryColor } from '../features/custommoves'

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
] as const

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
		await getDocumentClass(pack.metadata.type).deleteDocuments(idsToDelete, {
			pack: key
		})
		// @ts-expect-error outdated typing
		if (pack.folders.size > 0)
			// @ts-expect-error outdated typing
			await Folder.deleteDocuments(Array.from(pack.folders.keys()), {
				pack: key
			})
	}

	await Promise.all([
		processSFMoves(),
		processSFAssets(),
		processISAssets(),
		processSFOracles(),
		processISMoves(),
		processISOracles(),
		// processISTruths(), // Re-enable when DF includes them
		processSFTruths(),
		processSFEncounters().then(async () => {
			await processSFFoes()
		})
	])

	// Lock the packs again
	for (const key of PACKS) {
		await game.packs.get(key)?.configure({ locked: true })
	}
}

/**
 * MOVES
 */

function getMoveFolderData(
	moveCategory: IMoveCategory
): FolderDataConstructorData {
	return {
		name: `${moveCategory.Name} Moves`,
		type: 'Item',
		_id: hashLookup(moveCategory.$id),
		// workaround for incorrect move colors in DFv1
		color: MoveCategoryColor[moveCategory.Name],
		description: moveCategory.Description,
		sort:
			(moveCategory.Source.Page ?? 0) +
			(moveCategory.Source.Title.includes('Delve') ? 1000 : 0),
		flags: { 'foundry-ironsworn': { dfid: moveCategory.$id } }
	}
}

function movesForCategories(
	categories: IMoveCategory[]
): Array<ItemDataConstructorData & Record<string, unknown>> {
	const movesToCreate = [] as Array<
		ItemDataConstructorData & Record<string, unknown>
	>
	for (const category of categories) {
		const folder = hashLookup(category.$id)
		for (const move of category.Moves) {
			renderLinksInMove(move)
			const cleanMove = cleanDollars(move)

			console.log(move.Name, move.$id)
			movesToCreate.push({
				_id: hashLookup(cleanMove.dfid),
				type: 'sfmove',
				name: move.Name + (move.$id.endsWith('_alt') ? ' (alt)' : ''),
				img: 'icons/dice/d10black.svg',
				system: cleanMove,
				sort: move.Source.Page,
				folder
			})
		}
	}
	return movesToCreate
}

async function processISMoves() {
	const pack = 'foundry-ironsworn.ironswornmoves'
	await Folder.createDocuments(
		ISMoveCategories.map((moveCategory) => getMoveFolderData(moveCategory)),
		{ pack, keepId: true }
	)
	const movesToCreate = movesForCategories(ISMoveCategories)
	await Item.createDocuments(movesToCreate, {
		pack,
		keepId: true
	})
}
async function processSFMoves() {
	const pack = 'foundry-ironsworn.starforgedmoves'
	await Folder.createDocuments(
		SFMoveCategories.map((moveCategory) => getMoveFolderData(moveCategory)),
		{ pack, keepId: true }
	)
	const movesToCreate = movesForCategories(SFMoveCategories)
	await Item.createDocuments(movesToCreate, {
		pack,
		keepId: true
	})
}

/**
 * ASSSETS
 */

function getAssetFolderData(assetType: IAssetType): FolderDataConstructorData {
	return {
		name: assetType.Name,
		color: assetType.Display.Color,
		description: assetType.Description,
		type: 'Item',
		_id: hashLookup(assetType.$id),
		sort: assetType.Source.Page,
		flags: { 'foundry-ironsworn': { dfid: assetType.$id } }
	}
}

function assetsForTypes(types: IAssetType[]) {
	const assetsToCreate = [] as Array<
		ItemDataConstructorData & Record<string, unknown>
	>
	for (const assetType of types) {
		const folder = hashLookup(assetType.$id)
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
					enabled: asset['Condition Meter'] != null,
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
				folder,
				name: asset.Name,
				system: data
			})
		}
	}
	return assetsToCreate
}

async function processSFAssets() {
	const pack = 'foundry-ironsworn.starforgedassets'
	await Folder.createDocuments(
		SFAssetTypes.map((assetType) => getAssetFolderData(assetType)),
		{ pack, keepId: true }
	)
	const assetsToCreate = assetsForTypes(SFAssetTypes)
	await Item.createDocuments(assetsToCreate, {
		pack,
		keepId: true
	})
}

async function processISAssets() {
	const pack = 'foundry-ironsworn.ironswornassets'
	await Folder.createDocuments(
		ISAssetTypes.map((assetType) => getAssetFolderData(assetType)),
		{ pack, keepId: true }
	)
	const assetsToCreate = assetsForTypes(ISAssetTypes)
	await Item.createDocuments(assetsToCreate, {
		pack,
		keepId: true
	})
}

/**
 * ORACLES
 */

function getOracleFolderData(
	oracleBranch: IOracleCategory | IOracle,
	parent?: string
): FolderDataConstructorData {
	if ('Oracles' in oracleBranch)
		return {
			name: oracleBranch.Name,
			_id: hashLookup(oracleBranch.$id),
			type: 'RollTable',
			description: oracleBranch.Description,
			sort:
				(oracleBranch.Source.Page ?? 0) +
				(oracleBranch.Source.Title.includes('Delve') ? 1000 : 0),
			flags: { 'foundry-ironsworn': { dfid: oracleBranch.$id } },
			parent
		}
	console.log(oracleBranch)
	throw new Error("Data isn't an oracle tree branch")
}

async function processOracle(
	oracle: IOracle,
	output: {
		RollTable: RollTableDataConstructorData[]
		Folder: FolderDataConstructorData[]
	},
	folder: string
) {
	// Oracles JSON is a tree we wish to iterate through depth first adding
	// parents prior to their children, and children in order
	if (oracle.Table != null)
		output.RollTable.push({
			...OracleTable.getConstructorData(oracle as any),
			folder,
			name: oracle.Name + (oracle.$id.endsWith('_alt') ? ' (alt)' : ''),
			sort:
				(oracle.Source.Page ?? 0) +
				(oracle.Source.Title.includes('Delve') ? 1000 : 0)
		})

	if ('Oracles' in oracle)
		output.Folder.push(getOracleFolderData(oracle, folder))

	for (const child of oracle.Oracles ?? [])
		await processOracle(child, output, hashLookup(oracle.$id))
}
async function processOracleCategory(
	cat: IOracleCategory,
	output: {
		RollTable: RollTableDataConstructorData[]
		Folder: FolderDataConstructorData[]
	},
	/** The Foundry ID of the parent folder, if any. */
	parent?: string
) {
	const folderData = getOracleFolderData(cat, parent)
	output.Folder.push(folderData)
	for (const oracle of cat.Oracles ?? [])
		await processOracle(oracle, output, folderData._id as string)
	for (const child of cat.Categories ?? [])
		await processOracleCategory(child, output, folderData._id as string)
}

async function processSFOracles() {
	const toCreate: {
		RollTable: RollTableDataConstructorData[]
		Folder: FolderDataConstructorData[]
	} = { RollTable: [], Folder: [] }
	const pack = 'foundry-ironsworn.starforgedoracles'

	for (const category of SFOracleCategories) {
		await processOracleCategory(category, toCreate)
	}
	await Folder.createDocuments(toCreate.Folder, { pack, keepId: true })
	await OracleTable.createDocuments(toCreate.RollTable, {
		pack,
		keepId: true
	})
}

async function processISOracles() {
	const toCreate: {
		RollTable: RollTableDataConstructorData[]
		Folder: FolderDataConstructorData[]
	} = { RollTable: [], Folder: [] }

	const pack = 'foundry-ironsworn.ironswornoracles'

	for (const category of ISOracleCategories) {
		await processOracleCategory(category, toCreate)
	}
	await Folder.createDocuments(toCreate.Folder, { pack, keepId: true })
	await OracleTable.createDocuments(toCreate.RollTable, {
		pack,
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

/** Processes *existing* Starforged encounter Items into actors. Run it immediately after processSFEncounters or it won't work! */
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
				flags: {
					'foundry-ironsworn': { dfid: truth.$id, type: 'truth-category' }
				}
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
				type: 'text',
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
