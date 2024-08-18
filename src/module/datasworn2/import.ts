import type {
	AssetCollection,
	MoveCategory,
	ClockField,
	OracleTablesCollection,
	OracleCollection
} from '@datasworn/core/dist/Datasworn'
import { IdParser, DataswornTree } from '.'
import shajs from 'sha.js'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import Showdown from 'showdown'
import { capitalize, compact, flatten } from 'lodash-es'

// Import a local copy of the legacy ID maps
const LegacyToDataswornIds: Record<string, string> = {
	...require('../../../../datasworn/src/legacy_ids/dataforged/classic/assets.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/classic/moves.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/classic/npcs.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/classic/oracles.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/starforged/assets.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/starforged/moves.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/starforged/oracles.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/starforged/npcs.json'),
	...require('../../../../datasworn/src/legacy_ids/dataforged/starforged/truths.json')
}
const DataswornToLegacyIds: Record<string, string> = Object.fromEntries(
	Object.entries(LegacyToDataswornIds).map(([k, v]) => [v, k])
)
const lookupLegacyId = (dsid: string): string => {
	const legacyId = DataswornToLegacyIds[dsid]
	if (
		!legacyId &&
		!dsid.includes('sundered_isles') &&
		!dsid.includes('oracle_rollable.row:') &&
		!dsid.includes('truth:classic')
	) {
		console.log('!!! No legacy ID for', dsid)
	}
	return legacyId ?? dsid
}

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
		delve: 'delveoracles',
		starforged: 'starforgedoracles',
		sundered_isles: 'sunderedislesmoves'
	},
	oracle_rollable: {
		classic: 'ironswornoracles',
		delve: 'delveoracles',
		starforged: 'starforgedoracles',
		sundered_isles: 'sunderedislesmoves'
	},
	npc: {
		starforged: 'starforgedencounters',
		sundered_isles: 'sunderedislesmoves'
	},
	delve_site_theme: {
		delve: 'delve-themes'
	},
	delve_site_domain: {
		delve: 'delve-domains'
	}
}
function renderLinksInStr(str: string): string {
	return str.replace(MARKDOWN_LINK_RE, (match, text, url) => {
		if (!url.startsWith('datasworn:')) return match
		url = url.substring('datasworn:'.length)
		const parsed = IdParser.parse(url)

		// Strip links to NPC collections, Foundry has no support for them
		if (['npc', 'npc_collection'].includes(parsed.primaryTypeId)) {
			return text
		}

		// TODO: render move/oracle links as data-dfid anchors so they'll navigate properly

		// Fixup: embedded oracle tables will be imported as full RollTables
		// So here we redirect links to move-oracles to full oracles
		const typeId =
			parsed.typeIds.join('/') === 'move/oracle_rollable'
				? 'oracle_rollable'
				: parsed.primaryTypeId
		const compendiumKey = COMPENDIUM_KEY_MAP[typeId]?.[parsed.rulesPackageId]
		if (!compendiumKey) {
			console.log(
				`!!! No compendium key for ${match} (${typeId} / ${parsed.rulesPackageId})`,
				match
			)
			return match
		}

		const legacyId = lookupLegacyId(url)

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

// Returns the foundry ID of the folder
async function writeFolderJson(
	packName: string,
	cat: AssetCollection | MoveCategory | OracleCollection,
	parentFolderId?: string
): Promise<string> {
	if (!cat._id) {
		console.log('!!! No ID for category', cat)
		return ''
	}
	const legacyFolderId = DataswornToLegacyIds[cat._id]
	const folderHash = hash(legacyFolderId ?? cat._id)

	const json = {
		name: cat.name,
		color: cat.color ?? ISMoveCategoryColors[cat.name],
		description: renderLinksInStr(cat.description ?? cat.summary ?? ''),
		type: cat.type === 'oracle_collection' ? 'RollTable' : 'Item',
		_id: folderHash,
		sort: cat._source.page ?? 0,
		flags: {
			'foundry-ironsworn': {
				dfid: legacyFolderId,
				dsid: cat._id
			}
		},
		folder: parentFolderId ?? null,
		sorting: 'a',
		_key: `!folders!${folderHash}`
	}
	await writeJsonFile(packName, json)
	return json._id
}

console.log('\n\n--- ASSETS ---')
for (const collection of collections) {
	console.log(collection)
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
		const legacyFolderId = lookupLegacyId(cat._id)

		// Category assets
		for (const asset of Object.values(cat.contents)) {
			console.log('  ', asset._id)

			const legacyAssetId = lookupLegacyId(asset._id)
			const fid = hash(legacyAssetId ?? asset._id)

			const json: any = {
				type: 'asset',
				_id: fid,
				folder: legacyFolderId && hash(legacyFolderId),
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
		const legacyFolderId = lookupLegacyId(cat._id)

		for (const move of Object.values(cat.contents)) {
			console.log('  ', move._id)

			const legacyMoveId = lookupLegacyId(move._id)
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
					const matches = IdParser.getMatches(parsed as any, DataswornTree)
					return Array.from(matches.values()).map((m: any) => m._id)
				})
			)
			const legacyOracleIds = compact(dsOracleIds.map((o) => lookupLegacyId(o)))

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

console.log('\n\n--- ORACLES ---')
for (const collection of collections) {
	console.log(collection)

	const packName = {
		classic: 'ironsworn-oracles',
		delve: 'delve-oracles',
		starforged: 'starforged-oracles',
		sundered_isles: 'sundered-isles-oracles'
	}[collection]
	if (!packName) continue
	if (!existsSync(`json-packs/${packName}`)) {
		await mkdir(`json-packs/${packName}`)
	}

	const walkCollections = async (
		collections: Record<string, OracleCollection> | undefined,
		depth = 1,
		parentFolder?: string
	) => {
		for (const collection of Object.values(collections ?? {})) {
			console.log('  '.repeat(depth), collection._id)
			const legacyFolderId = lookupLegacyId(collection._id)

			// Create a folder
			const folderId = await writeFolderJson(packName, collection, parentFolder)

			for (const oracle of Object.values(collection.contents)) {
				// Write the json for an oracle
				console.log('  '.repeat(depth + 1), oracle._id)

				const legacyOracleId = lookupLegacyId(oracle._id)
				const fid = hash(legacyOracleId ?? oracle._id)

				const json = {
					_id: fid,
					flags: {
						'foundry-ironsworn': {
							dfid: DataswornToLegacyIds[oracle._id],
							category: legacyFolderId,
							dsid: oracle._id
						}
					},
					name: oracle.name,
					description: renderText(oracle.summary ?? ''),
					formula: oracle.dice,
					replacement: true,
					displayRoll: true,
					results: compact(
						oracle.rows.map((row) => {
							if (!row.roll) return undefined
							const rowId = hash(lookupLegacyId(row._id))
							return {
								range: [row.roll.min, row.roll.max],
								text: row.text,
								_key: `!tables.results!${fid}.${rowId}`,
								_id: rowId
							}
						})
					),
					folder: folderId,
					sort: oracle._source?.page ?? 0,
					img: 'icons/dice/d10black.svg',
					_key: `!tables!${fid}`
				}

				await writeJsonFile(packName, json)
			}
			const pc = collection as OracleTablesCollection
			await walkCollections(pc.collections, depth + 1, folderId)
		}
	}

	await walkCollections(DataswornTree.get(collection)?.oracles)
}

console.log('\n\n--- THEMES ---')
const THEME_IMAGES = {
	Ancient: 'icons/environment/wilderness/carved-standing-stone.webp',
	Corrupted: 'icons/magic/unholy/beam-impact-purple.webp',
	Fortified: 'icons/environment/settlement/watchtower-cliff.webp',
	Hallowed: 'icons/magic/holy/angel-wings-gray.webp',
	Haunted: 'icons/creatures/magical/spirit-undead-horned-blue.webp',
	Infested: 'icons/creatures/eyes/icy-cluster-blue.webp',
	Ravaged: 'icons/environment/settlement/building-rubble.webp',
	Wild: 'icons/magic/nature/root-vines-grow-brown.webp'
}
const delve = DataswornTree.get('delve')
for (const theme of Object.values(delve?.site_themes ?? {})) {
	console.log(theme._id)
	if (!existsSync('json-packs/delve-themes')) {
		await mkdir('json-packs/delve-themes')
	}

	const fid = hash(theme._id)

	const json = {
		_id: fid,
		type: 'delve-theme',
		name: theme.name,
		img: THEME_IMAGES[theme.name],
		system: {
			summary: (theme as any).summary,
			description: renderLinksInStr((theme as any).description),
			features: compact(
				theme.features.map(
					(f) =>
						f.roll && {
							range: [f.roll?.min, f.roll?.max],
							text: f.text
						}
				)
			),
			dangers: compact(
				theme.dangers.map(
					(d) =>
						d.roll && {
							range: [d.roll?.min, d.roll?.max],
							text: d.text
						}
				)
			)
		},
		folder: null,
		sort: theme._source.page ?? 0,
		flags: {
			'foundry-ironsworn': {
				dsid: theme._id
			}
		},
		_key: `!items!${fid}`
	}

	await writeJsonFile('delve-themes', json)
}

console.log('\n\n--- DOMAINS ---')
const DOMAIN_IMAGES = {
	Barrow: 'icons/environment/wilderness/cave-entrance-dwarven-hill.webp',
	Cavern: 'icons/environment/wilderness/cave-entrance-mountain-blue.webp',
	'Frozen cavern': 'icons/magic/water/water-iceberg-bubbles.webp',
	Icereach: 'icons/magic/water/barrier-ice-crystal-wall-jagged-blue.webp',
	Mine: 'icons/environment/settlement/mine-cart-rocks-red.webp',
	Pass: 'icons/environment/wilderness/cave-entrance-rocky.webp',
	Ruin: 'icons/environment/wilderness/wall-ruins.webp',
	'Sea cave': 'icons/environment/wilderness/cave-entrance-island.webp',
	Shadowfen: 'icons/environment/wilderness/cave-entrance.webp',
	Stronghold: 'icons/environment/settlement/castle.webp',
	Tanglewood: 'icons/environment/wilderness/terrain-forest-gray.webp',
	Underkeep: 'icons/environment/wilderness/mine-interior-dungeon-door.webp'
}
for (const domain of Object.values(delve?.site_domains ?? {})) {
	console.log(domain._id)
	if (!existsSync('json-packs/delve-domains')) {
		await mkdir('json-packs/delve-domains')
	}

	const fid = hash(domain._id)

	const json = {
		_id: fid,
		type: 'delve-domain',
		name: domain.name,
		img: DOMAIN_IMAGES[domain.name],
		system: {
			summary: (domain as any).summary,
			description: renderLinksInStr((domain as any).description),
			features: compact(
				domain.features.map(
					(f) =>
						f.roll && {
							range: [f.roll?.min, f.roll?.max],
							text: f.text
						}
				)
			),
			dangers: compact(
				domain.dangers.map(
					(d) =>
						d.roll && {
							range: [d.roll?.min, d.roll?.max],
							text: d.text
						}
				)
			)
		},
		folder: null,
		sort: domain._source.page ?? 0,
		flags: {
			'foundry-ironsworn': {
				dsid: domain._id
			}
		},
		_key: `!items!${fid}`
	}

	await writeJsonFile('delve-domains', json)
}

console.log('\n\n--- TRUTHS ---')
for (const collection of collections) {
	console.log(collection)
	const packName = {
		classic: 'ironsworn-truths',
		starforged: 'starforged-truths',
		sundered_isles: 'sundered-isles-truths'
	}[collection]
	if (!packName) continue
	if (!existsSync(`json-packs/${packName}`)) {
		await mkdir(`json-packs/${packName}`)
	}

	const truthCategories = DataswornTree.get(collection)?.truths ?? {}
	for (const cat of Object.values(truthCategories)) {
		console.log('  ', cat._id)

		const catFid = hash(lookupLegacyId(cat._id))

		const commonPageContent = {
			title: {
				show: true,
				level: 1
			},
			src: null,
			sort: 0
		}

		const json = {
			name: cat.name,
			flags: {
				'foundry-ironsworn': {
					dfid: lookupLegacyId(cat._id),
					dsid: cat._id
				}
			},
			_id: catFid,
			pages: compact([
				...cat.options.map((o) => {
					const oFid = hash(o._id)
					const firstOracle = Object.values(o.oracles ?? {})[0]
					// Trim out embedded tables
					// TODO: insert a link instead?
					const stripTableEmbeds = (txt: string): string =>
						txt.replace(/{{table>.*?}}/, '(roll below)').trim()
					return {
						type: 'truth',
						name: o.summary ?? '',
						system: {
							Subtable: firstOracle?.rows?.map((row) => ({
								dfid: LegacyToDataswornIds[row._id],
								Floor: row.roll.min,
								Ceiling: row.roll.max,
								Result: renderLinksInStr(row.text)
							})),
							dfid: LegacyToDataswornIds[o._id],
							dsid: o._id,
							Floor: o.roll.min,
							Ceiling: o.roll.max,
							Result: renderLinksInStr(o.summary ?? ''),
							Description: renderLinksInStr(
								stripTableEmbeds(o.description ?? '')
							),
							Quest: renderLinksInStr(o.quest_starter),
							'Roll template': {
								Description: o.description
							}
						},
						_id: oFid,
						...commonPageContent,
						_key: `!journal.pages!${catFid}.${oFid}`
					}
				}),
				cat.your_character && {
					name: 'Character Inspiration',
					type: 'text',
					text: {
						markdown: renderLinksInStr(cat.your_character),
						format: 2,
						content: renderText(cat.your_character)
					},
					_id: hash(cat._id + 'your_character'),
					...commonPageContent,
					_key: `!journal.pages!${catFid}.${hash(cat._id + 'your_character')}`
				}
			]),
			folder: null,
			sort: cat._source.page ?? 0,
			_key: `!journal!${catFid}`
		}

		await writeJsonFile(packName, json)
	}
}
