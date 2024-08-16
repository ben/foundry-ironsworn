import type {
	AssetCollection,
	MoveCategory,
	ClockField
} from '@datasworn/core/dist/DataswornSource'
import LegacyIdMap from '@datasworn/core/json/legacy_id_map.json' assert { type: 'json' }
import { IdParser, DataswornTree } from '.'
import shajs from 'sha.js'
import { capitalize, startCase } from 'lodash-es'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import Showdown from 'showdown'

// TODO: legacy id map fixes
LegacyIdMap['asset:starforged/module/engine_upgrade'] =
	'Starforged/Assets/Module/Engine_Upgrade'
LegacyIdMap['asset:starforged/module/internal_refit'] =
	'Starforged/Assets/Module/Internal_Refit'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.likely'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Likely'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.almost_certain'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Almost_Certain'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.fifty_fifty'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Fifty-fifty'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.likely'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Likely'

// A script to import Datasworn 2 data into compendia JSON files.
// Run this like so:
//   npx tsx src/module/datasworn2/import.ts

const markdownRenderer = new Showdown.Converter()

const collections = ['classic', 'classic_delve', 'starforged', 'sundered_isles']

function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g
const COMPENDIUM_KEY_MAP = {
	asset: {
		classic: 'ironswornassets',
		starforged: 'starforgedassets',
		sundered_isles: 'sunderedislesassets'
	},
	move_category: {
		classic: 'ironswornmoves',
		starforged: 'starforgedmoves',
		sundered_isles: 'sunderedislesmoves'
	},
	move: {
		classic: 'ironswornmoves',
		delve: 'ironswornmoves',
		starforged: 'starforgedmoves',
		sundered_isles: 'sunderedislesmoves'
	},
	oracle_collection: {
		classic: 'ironswornoracles',
		starforged: 'starforgedoracles',
		sundered_isles: 'sunderedislesmoves'
	},
	oracle_rollable: {
		classic: 'ironswornoracles',
		starforged: 'starforgedoracles',
		sundered_isles: 'sunderedislesmoves'
	},
	npc: {
		starforged: 'starforgedencounters',
		sundered_isles: 'sunderedislesmoves'
	}
}
function renderLinksInStr(text: string): string {
	return text.replace(MARKDOWN_LINK_RE, (match, text, url) => {
		if (!url.startsWith('datasworn:')) return match
		url = url.substring('datasworn:'.length)
		const parsed = IdParser.parse(url)

		// Fixup: embedded oracle tables will be imported as full RollTables
		// So here we redirect links to move-oracles to full oracles
		const typeId =
			parsed.typeIds.join('/') === 'move/oracle_rollable'
				? 'oracle_rollable'
				: parsed.primaryTypeId
		const compendiumKey = COMPENDIUM_KEY_MAP[typeId][parsed.rulesPackageId]
		if (!compendiumKey) return match

		const legacyId = LegacyIdMap[url]
		if (!legacyId && !/sundered_isles/.test(url)) {
			console.log('!!! No legacy ID for', url)
		}

		if (parsed.primaryTypeId === 'oracle_collection') {
			return `<a class="entity-link oracle-category-link" data-dfid="${legacyId}" data-dsid="${url}"><i class="fa fa-caret-right"></i> ${text}</a>`
		}
		const urlHash = hash(legacyId || url)
		return `@Compendium[foundry-ironsworn.${compendiumKey}.${urlHash}]{${text}}`
	})
}

function renderText(text: string): string {
	return markdownRenderer.makeHtml(renderLinksInStr(text))
}

function titleCase(str: string): string {
	const skipWords = [
		'a',
		'an',
		'the',
		'and',
		'but',
		'or',
		'of',
		'for',
		'nor',
		'on',
		'at',
		'to',
		'from',
		'by',
		'with'
	]
	return str.replace(/[^\s/]+/g, (word) =>
		skipWords.includes(word) ? word : word[0].toUpperCase() + word.substring(1)
	)
}

async function writeJsonFile(packName: string, json: any) {
	const fileName = json.name.replace(/\W/g, '_')
	await writeFile(
		`json-packs/${packName}/${fileName}_${json._id}.json`,
		JSON.stringify(json, null, 2)
	)
}

async function writeFolderJson(
	packName: string,
	cat: AssetCollection | MoveCategory
) {
	const name = cat.name.replace(/ (Assets|Moves)/, '')
	console.log(` ${name}/`)

	if (!cat._id) {
		console.log('!!! No ID for category', cat)
		return
	}
	const legacyFolderId = LegacyIdMap[cat._id]
	const folderHash = hash(legacyFolderId ?? cat._id)

	const json = {
		name,
		color: cat.color,
		description: renderLinksInStr(cat.description ?? ''),
		type: 'Item',
		_id: folderHash,
		sort:
			(cat._source.page ?? 0) +
			(cat._source.title.includes('Delve') ? 1000 : 0),
		flags: {
			'foundry-ironsworn': {
				dfid: legacyFolderId,
				dsid: cat._id
			}
		},
		folder: null,
		sorting: 'a',
		_key: `!folders!${folderHash}`
	}
	await writeJsonFile(packName, json)
}

console.log('\n\n--- ASSETS ---')
for (const collection of collections) {
	console.log(collection)
	const legacyCollection = collection === 'classic' ? 'ironsworn' : collection
	const packName = {
		classic: 'assets',
		starforged: 'starforged-assets',
		sundered_isles: 'sundered-isles-assets'
	}[collection]
	if (!packName) continue
	if (!existsSync(`json-packs/${packName}`)) {
		await mkdir(`json-packs/${packName}`)
	}

	const assetCategories = DataswornTree.get(collection)?.assets
	for (const cat of Object.values(assetCategories ?? {})) {
		// Folder for category
		await writeFolderJson(packName, cat)
		const legacyFolderId = LegacyIdMap[cat._id] ?? cat._id
		if (!legacyFolderId && !cat._id.includes('sundered_isles')) {
			console.log('!!! No legacy ID for', cat._id)
		}

		// Category assets
		for (const asset of Object.values(cat.contents)) {
			console.log('  ', asset._id)

			const legacyAssetId = LegacyIdMap[asset._id] || asset._id
			const fid = hash(legacyAssetId)

			const json: any = {
				type: 'asset',
				_id: fid,
				folder: hash(legacyFolderId),
				name: asset.name,
				system: {
					requirement: renderText(asset.requirement ?? ''),
					category: asset.category,
					color: asset.color ?? null,
					fields: [],
					abilities: asset.abilities.map((a) => {
						const clock = a.controls?.clock as ClockField | undefined
						return {
							enabled: a.enabled,
							description: renderText(a.text),
							hasClock: !!clock,
							clockTicks: 0,
							clockMax: clock?.max ?? 4
						}
					}),
					track: {
						enabled: false,
						name: 'Health',
						current: 0,
						max: 5,
						value: 5,
						min: 0
					},
					exclusiveOptions: [],
					conditions: [],
					description: ''
				},
				img: 'icons/svg/item-bag.svg',
				effects: [],
				sort: 0,
				ownership: {
					default: 0
				},
				flags: {
					'foundry-ironsworn': {
						dfid: legacyAssetId,
						dsid: asset._id
					}
				},
				_stats: {
					systemId: 'foundry-ironsworn'
				},
				_key: `!items!${fid}`
			}
			// Fields and exclusive options
			for (const option of [
				...Object.values(asset.options),
				...Object.values(asset.controls ?? {})
			]) {
				if (option.field_type === 'text') {
					json.system.fields.push({
						name: titleCase(option.label),
						value: option.value ?? ''
					})
				}
				if (
					option.field_type === 'select_value' ||
					option.field_type === 'select_enhancement'
				) {
					for (const choice of Object.values(option.choices)) {
						json.system.exclusiveOptions.push({
							name: titleCase(choice.label),
							selected: false
						})
					}
				}
			}
			// Track
			for (const control of Object.values(asset.controls ?? {})) {
				// console.log(control)
				if (control.field_type === 'condition_meter') {
					// Add a track
					json.system.track = {
						enabled: true,
						name: titleCase(control.label),
						max: control.max ?? 0,
						value: control.value ?? 0,
						min: control.min ?? 0
					}
					for (const subcontrol of Object.values(control.controls ?? {})) {
						if (['checkbox', 'card_flip'].includes(subcontrol.field_type)) {
							// A condition!
							json.system.conditions.push({
								name: titleCase(subcontrol.label),
								ticked: subcontrol.value
							})
						}
					}
				}
			}

			await writeJsonFile(packName, json)
		}
	}
}
