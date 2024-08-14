import type { ClockField } from '@datasworn/core/dist/DataswornSource'
import LegacyIdMap from '@datasworn/core/json/legacy_id_map.json' assert { type: 'json' }
import { IdParser, DataswornTree } from '.'
import shajs from 'sha.js'
import { capitalize, startCase, titleCase } from 'lodash-es'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import Showdown from 'showdown'

// A script to import Datasworn 2 data into compendia JSON files.
// Run this like so:
//   npx tsx src/module/datasworn2/import.ts

const markdownRenderer = new Showdown.Converter()

const collections = ['classic', 'starforged', 'sundered_isles']

function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g
const COMPENDIUM_KEY_MAP = {
	asset: {
		classic: 'ironswornassets',
		starforged: 'starforgedassets',
		sundered_isles: 'sunderedislesassetss'
	},
	move_category: {
		classic: 'ironswornmoves',
		starforged: 'starforgedmoves',
		sundered_isles: 'sunderedislesmoves'
	},
	move: {
		classic: 'ironswornmoves',
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
		const compendiumKey =
			COMPENDIUM_KEY_MAP[parsed.primaryTypeId][parsed.rulesPackageId]
		if (!compendiumKey) return match
		if (parsed.primaryTypeId === 'oracle_collection') {
			return `<a class="entity-link oracle-category-link" data-dfid="${url}"><i class="fa fa-caret-right"></i> ${text}</a>`
		}
		const urlHash = hash(LegacyIdMap[url] || url)
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
		'for',
		'nor',
		'on',
		'at',
		'to',
		'from',
		'by',
		'with'
	]
	return str.replace(/\w+/g, (word) =>
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

// ASSETS
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
		const name = cat.name.replace(' Assets', '')
		console.log(` ${name}/`)
		const legacyFolderId: string =
			LegacyIdMap[cat._id] ??
			`${capitalize(legacyCollection)}/Assets/${startCase(name).replace(
				/\W/g,
				'_'
			)}`
		const json = {
			name,
			color: cat.color,
			description: renderLinksInStr(cat.description ?? ''),
			type: 'Item',
			_id: hash(legacyFolderId),
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
			_key: `!folders!${hash(legacyFolderId)}`
		}
		await writeJsonFile(packName, json)

		for (const asset of Object.values(cat.contents)) {
			console.log('  ', asset._id)

			// Generate a hash, use the legacy ID if it exists to preserve the old ID
			const assetId = LegacyIdMap[asset._id] || asset._id
			const fid = hash(assetId)

			const json: any = {
				type: 'asset',
				_id: fid,
				folder: hash(legacyFolderId),
				name: asset.name,
				system: {
					requirement: renderText(asset.requirement ?? ''),
					category: asset.category,
					color: asset.color,
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
				flags: {},
				_key: `!items!${fid}`
			}
			// Fields
			for (const option of Object.values(asset.options)) {
				if (option.field_type === 'text') {
					json.system.fields.push({
						name: titleCase(option.label),
						value: option.value ?? ''
					})
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
