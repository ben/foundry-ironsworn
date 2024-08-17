import type {
	AssetCollection,
	MoveCategory,
	ClockField
} from '@datasworn/core/dist/DataswornSource'
import LegacyIdMap from '@datasworn/core/json/legacy_id_map.json' assert { type: 'json' }
import { IdParser, DataswornTree } from '.'
import shajs from 'sha.js'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import Showdown from 'showdown'
import { capitalize, compact, flatten } from 'lodash-es'

// TODO: SF pay the price has these suggestions
// +      "oracle_rollable:*/**/peril",
// +      "oracle_rollable:*/**/peril/**"

// TODO: submit legacy id map fixes to rsek
LegacyIdMap['asset:starforged/module/engine_upgrade'] =
	'Starforged/Assets/Module/Engine_Upgrade'
LegacyIdMap['asset:starforged/module/internal_refit'] =
	'Starforged/Assets/Module/Internal_Refit'

LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.almost_certain'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Almost_Certain'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.likely'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Likely'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.fifty_fifty'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Fifty-fifty'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.unlikely'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Unlikely'
LegacyIdMap['move.oracle_rollable:classic/fate/ask_the_oracle.small_chance'] =
	'Ironsworn/Oracles/Moves/Ask_the_Oracle/Small_Chance'
LegacyIdMap[
	'move.oracle_rollable:starforged/fate/ask_the_oracle.almost_certain'
] = 'Starforged/Oracles/Moves/Ask_the_Oracle/Almost_Certain'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.likely'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Likely'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.fifty_fifty'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Fifty-fifty'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.unlikely'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Unlikely'
LegacyIdMap[
	'move.oracle_rollable:starforged/fate/ask_the_oracle.small_chance'
] = 'Starforged/Oracles/Moves/Ask_the_Oracle/Small_Chance'
LegacyIdMap['move.oracle_rollable:starforged/fate/ask_the_oracle.likely'] =
	'Starforged/Oracles/Moves/Ask_the_Oracle/Likely'

LegacyIdMap['move.oracle_rollable:classic/suffer/endure_stress.endure_stress'] =
	'Ironsworn/Oracles/Moves/Endure_Stress'
LegacyIdMap['move.oracle_rollable:classic/suffer/endure_harm.endure_harm'] =
	'Ironsworn/Oracles/Moves/Endure_Harm'
LegacyIdMap['move.oracle_rollable:classic/fate/pay_the_price.pay_the_price'] =
	'Ironsworn/Oracles/Moves/Pay_the_Price'
LegacyIdMap[
	'move.oracle_rollable:starforged/session/begin_a_session.begin_a_session'
] = 'Starforged/Oracles/Moves/Begin_a_Session'
LegacyIdMap[
	'move.oracle_rollable:starforged/exploration/confront_chaos.confront_chaos'
] = 'Starforged/Oracles/Moves/Confront_Chaos'
LegacyIdMap['move.oracle_rollable:starforged/suffer/endure_harm.endure_harm'] =
	'Starforged/Oracles/Moves/Endure_Harm'
LegacyIdMap[
	'move.oracle_rollable:starforged/suffer/endure_stress.endure_stress'
] = 'Starforged/Oracles/Moves/Endure_Stress'
LegacyIdMap[
	'move.oracle_rollable:starforged/exploration/make_a_discovery.make_a_discovery'
] = 'Starforged/Oracles/Moves/Make_a_Discovery'
LegacyIdMap[
	'move.oracle_rollable:starforged/fate/pay_the_price.pay_the_price'
] = 'Starforged/Oracles/Moves/Pay_the_Price'
LegacyIdMap[
	'move.oracle_rollable:starforged/combat/take_decisive_action.take_decisive_action'
] = 'Starforged/Oracles/Moves/Take_Decisive_Action'
LegacyIdMap[
	'move.oracle_rollable:starforged/suffer/withstand_damage.withstand_damage'
] = 'Starforged/Oracles/Moves/Withstand_Damage'

LegacyIdMap['oracle_rollable:starforged/misc/story_clue'] =
	'Starforged/Oracles/Misc/Story_Clue'
LegacyIdMap['oracle_rollable:starforged/misc/story_complication'] =
	'Starforged/Oracles/Misc/Story_Complication'

LegacyIdMap['move_category:classic/quest'] = 'Ironsworn/Moves/Quest'
LegacyIdMap['move_category:classic/fate'] = 'Ironsworn/Moves/Fate'
LegacyIdMap['move_category:classic/suffer'] = 'Ironsworn/Moves/Suffer'

const ISMoveCategoryColors = {
	'Adventure Moves': '#206087',
	'Combat Moves': '#818992',
	'Connection Moves': '#4A5791',
	// non-canonical (ironsworn); uses color from 'Exploration'
	'Delve Moves': '#427FAA',
	'Exploration Moves': '#427FAA',
	// non-canonical (ironsworn); uses color from 'Legacy'.
	'Failure Moves': '#4F5A69',
	'Fate Moves': '#8F477B',
	'Legacy Moves': '#4F5A69',
	'Quest Moves': '#805A90',
	// non-canonical (ironsworn); uses color from 'Recover'
	'Rarity Moves': '#488B44',
	'Recover Moves': '#488B44',
	// non-canonical (ironsworn); uses color from 'Connection'
	'Relationship Moves': '#4A5791',
	'Scene Challenge': '#206087',
	'Session Moves': '#3F8C8A',
	'Suffer Moves': '#883529',
	// non-canonical (ironsworn); uses color from 'Session'
	'Threat Moves': '#3F8C8A',
	'Threshold Moves': '#1D1D1B'
}
// A script to import Datasworn 2 data into compendia JSON files.
// Run this like so:
//   npx tsx src/module/datasworn2/import.ts

const markdownRenderer = new Showdown.Converter({ tables: true })

const collections = ['classic', 'delve', 'starforged', 'sundered_isles']

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
		delve: 'ironsworndelvemoves',
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
	console.log(` ${cat.name}/`)

	if (!cat._id) {
		console.log('!!! No ID for category', cat)
		return
	}
	const legacyFolderId = LegacyIdMap[cat._id]
	const folderHash = hash(legacyFolderId ?? cat._id)

	const json = {
		name: cat.name,
		color: cat.color ?? ISMoveCategoryColors[cat.name],
		description: renderLinksInStr(cat.description ?? cat.summary ?? ''),
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

			const legacyAssetId = LegacyIdMap[asset._id]
			if (!legacyAssetId && !asset._id.includes('sundered_isles')) {
				console.log('!!! No legacy ID for', asset._id)
			}
			const fid = hash(legacyAssetId ?? asset._id)

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

console.log('\n\n--- MOVES ---')
for (const collection of collections) {
	console.log(collection)
	const legacyCollection = collection === 'classic' ? 'ironsworn' : collection
	const packName = {
		classic: 'ironsworn-moves',
		delve: 'delve-moves',
		starforged: 'starforged-moves',
		sundered_isles: 'sundered-isles-moves'
	}[collection]
	if (!packName) continue
	if (!existsSync(`json-packs/${packName}`)) {
		await mkdir(`json-packs/${packName}`)
	}

	const moveCategories = DataswornTree.get(collection)?.moves
	for (const cat of Object.values(moveCategories ?? {})) {
		// Folder for category
		await writeFolderJson(packName, cat)
		const legacyFolderId = LegacyIdMap[cat._id] ?? cat._id
		if (!legacyFolderId && !cat._id.includes('sundered_isles')) {
			console.log('!!! No legacy ID for', cat._id)
		}

		for (const move of Object.values(cat.contents)) {
			console.log('  ', move._id)

			const legacyMoveId = LegacyIdMap[move._id]
			if (!legacyMoveId && !move._id.includes('sundered_isles')) {
				console.log('!!! No legacy ID for', move._id)
			}
			const fid = hash(legacyMoveId ?? move._id)

			// Trim out embedded tables
			// TODO: insert a link instead?
			const stripTableEmbeds = (txt: string): string =>
				txt.replace(/{{table>.*?}}/, '').trim()

			// Process oracle IDs
			const oracleIdPatterns = [
				...Object.values(move.oracles ?? {}).map((o) => o._id),
				...Object.values(move.suggestions ?? {})
			]
			const dsOracleIds = flatten(
				oracleIdPatterns.map((o) => {
					const parsed = IdParser.parse(o)
					const matches = IdParser.getMatches(parsed, DataswornTree)
					return Array.from(matches.values()).map((m) => m._id)
				})
			)
			const legacyOracleIds = compact(
				dsOracleIds.map((o) => {
					const legacyId = LegacyIdMap[o]
					if (!legacyId) {
						console.log('!!! No legacy ID for', o)
					}
					return legacyId
				})
			)

			const json: any = {
				_id: fid,
				type: 'sfmove',
				name: move.name,
				img: 'icons/dice/d10black.svg',
				folder: hash(legacyFolderId),
				system: {
					dfid: legacyMoveId ?? move._id,
					Category: legacyFolderId ?? cat._id,
					'Progress Move': ['special_track', 'progress_roll'].includes(
						move.roll_type
					),
					'Variant of': '',
					Text: renderLinksInStr(stripTableEmbeds(move.text)),
					Trigger: {
						Text: renderLinksInStr(move.trigger.text),
						Options: move.trigger.conditions.map((c) => ({
							Text: c.text ?? '',
							'Roll type':
								['player_choice', 'highest', 'lowest'].includes(c.method) &&
								c.roll_options.length === 1 &&
								c.roll_options[0].using !== 'bonds_legacy'
									? 'Action roll'
									: 'Progress roll',
							Method: {
								player_choice: 'Any',
								highest: 'Highest',
								lowest: 'Lowest',
								progress_roll: 'Any',
								all: 'All'
							}[c.method],
							Using: c.roll_options.map((r) => {
								if (r.using === 'asset_control') {
									if (r.assets?.[0]?.includes('companion')) {
										return 'Companion Health'
									}
									if (r.control === 'integrity') {
										return 'Vehicle Integrity'
									}
								}

								if (r.using === 'condition_meter') {
									return capitalize(r.condition_meter)
								}
								if (r.stat) {
									return capitalize(r.stat)
								}
								return titleCase(r.using.replace('_', ' '))
							})
						}))
					},
					Outcomes: {
						'Strong Hit': {
							Text: renderLinksInStr(
								stripTableEmbeds(move.outcomes?.strong_hit.text ?? '')
							),
							'With a Match': {
								Text: ''
							}
						},
						'Weak Hit': {
							Text: renderLinksInStr(
								stripTableEmbeds(move.outcomes?.weak_hit.text ?? '')
							)
						},
						Miss: {
							Text: renderLinksInStr(
								stripTableEmbeds(move.outcomes?.miss.text ?? '')
							),
							'With a Match': {
								Text: ''
							}
						}
					},
					Oracles: legacyOracleIds,
					dsOracleIds,
					Source: {
						Title: move._source.title,
						Authors: move._source.authors.map((x) => x.name),
						Date: move._source.date,
						Page: move._source.page
					},
					Suggestions: {},
					Display: {
						Images: []
					}
				},
				sort: move._source.page ?? 0,
				flags: {
					'foundry-ironsworn': {
						dfid: legacyMoveId,
						dsid: move._id
					}
				},
				_key: `!items!${fid}`
			}

			await writeJsonFile(packName, json)
		}
	}
}
