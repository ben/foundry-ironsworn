import type { ClockField } from '@datasworn/core/dist/DataswornSource'
import { IdParser } from '.'
import shajs from 'sha.js'
import { capitalize } from 'lodash-es'
import { writeFile } from 'fs/promises'
import Showdown from 'showdown'

const markdownRenderer = new Showdown.Converter()

const collections = [
	// 'classic',
	'starforged'
	// 'sundered_isles'
]

function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g
const COMPENDIUM_KEY_MAP = {
	move: {
		ironsworn: 'ironswornmoves',
		starforged: 'starforgedmoves'
	},
	oracle_collection: {
		ironsworn: 'ironswornoracles',
		starforged: 'starforgedoracles'
	},
	npc: {
		starforged: 'starforgedencounters'
	}
}
export function renderLinksInStr(text: string): string {
	return text.replace(MARKDOWN_LINK_RE, (match, text, url) => {
		if (!url.startsWith('datasworn:')) return match
		url = url.substring('datasworn:'.length)
		const parsed = IdParser.parse(url)
		const compendiumKey =
			COMPENDIUM_KEY_MAP[parsed.primaryTypeId][parsed.rulesPackageId]
		if (!compendiumKey) return match
		if (idIsOracleLink(url)) {
			return `<a class="entity-link oracle-category-link" data-dfid="${url}"><i class="fa fa-caret-right"></i> ${text}</a>`
		}
		return `@Compendium[foundry-ironsworn.${compendiumKey}.${hash(
			url
		)}]{${text}}`
	})
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
	const keys = Array.from(assets.keys())
	console.log(collection, keys.length)
	for (const k of assets.keys()) {
		// TODO: compute the legacy key somehow, if it exists
		// That way we can preserve the existing IDs by hashing the old key
		const asset = assets.get(k)
		if (asset === undefined) continue

		const fid = hash(asset._id as string)
		console.log(asset?._id, fid)
		const json: any = {
			type: 'asset',
			_id: fid,
			folder: '9b891b1ca6ac0bad',
			name: asset.name,
			system: {
				requirement: asset.requirement ?? '',
				category: asset.category,
				color: asset.color,
				fields: [],
				abilities: asset.abilities.map((a) => {
					const clock = a.controls?.clock as ClockField | undefined
					return {
						enabled: a.enabled,
						description: markdownRenderer.makeHtml(a.text), // TODO: convert links
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
		for (const control of Object.values(asset.controls ?? {})) {
			// console.log(control)
			if (control.field_type === 'condition_meter') {
				// Add a track
				json.system.track = {
					enabled: true,
					name: capitalize(control.label),
					max: control.max ?? 0,
					value: control.value ?? 0,
					min: control.min ?? 0
				}
				for (const subcontrol of Object.values(control.controls ?? {})) {
					if (['checkbox', 'card_flip'].includes(subcontrol.field_type)) {
						// A condition!
						json.system.conditions.push({
							name: capitalize(subcontrol.label),
							ticked: subcontrol.value
						})
					}
				}
			}
		}

		const fileName = json.name.replace(/\s/g, '_')
		await writeFile(
			`json-packs/${packName}/${fileName}_${fid}.json`,
			JSON.stringify(json, null, 2)
		)
		process.exit()
	}
}
