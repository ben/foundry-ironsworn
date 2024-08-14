import type { ClockField } from '@datasworn/core/dist/DataswornSource'
import LegacyIdMap from '@datasworn/core/json/legacy_id_map.json' assert { type: 'json' }
import { IdParser } from '.'
import shajs from 'sha.js'
import { capitalize, startCase, titleCase } from 'lodash-es'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import Showdown from 'showdown'

const markdownRenderer = new Showdown.Converter()

const collections = ['classic', 'starforged', 'sundered_isles']

function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g
const COMPENDIUM_KEY_MAP = {
	asset: {
		ironsworn: 'ironswornassets',
		starforged: 'starforgedassets',
		sundered_isles: 'sunderedislesassetss'
	},
	move: {
		ironsworn: 'ironswornmoves',
		starforged: 'starforgedmoves',
		sundered_isles: 'sunderedislesmoves'
	},
	oracle_collection: {
		ironsworn: 'ironswornoracles',
		starforged: 'starforgedoracles',
		sundered_isles: 'sunderedislesmoves'
	},
	oracle_rollable: {
		ironsworn: 'ironswornoracles',
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

// ASSETS
for (const collection of collections) {
	const packName = {
		classic: 'assets',
		starforged: 'starforged-assets',
		sundered_isles: 'sundered-isles-assets'
	}[collection]

	const assets = IdParser.getMatches(
		`asset:${collection}/*/*`,
		IdParser.datasworn
	)
	console.log(collection, assets.size)

	for (const asset of assets.values()) {
		if (asset === undefined) continue
		console.log('  ', asset._id)

		// Generate a hash, use the legacy ID if it exists to preserve the old ID
		const assetId = LegacyIdMap[asset._id] || asset._id
		const fid = hash(assetId)

		// Generate a folder hash
		const legacyFolderId = `${capitalize(collection)}/Assets/${startCase(
			asset.category
		).replace(' ', '_')}`
		const folderId = hash(legacyFolderId)

		const json: any = {
			type: 'asset',
			_id: fid,
			folder: folderId,
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
					enabled: false
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

		const fileName = json.name.replace(/\W/g, '_')
		if (!existsSync(`json-packs/${packName}`)) {
			await mkdir(`json-packs/${packName}`)
		}
		await writeFile(
			`json-packs/${packName}/${fileName}_${fid}.json`,
			JSON.stringify(json, null, 2)
		)
	}
}
