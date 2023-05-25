import type { DelveSiteFeatureOrDanger } from './item/itemtypes'

const THEME_IMAGES = {
	Ancient: 'icons/environment/wilderness/carved-standing-stone.webp',
	Corrupted: 'icons/magic/unholy/beam-impact-purple.webp',
	Fortified: 'icons/environment/settlement/watchtower-cliff.webp',
	Hallowed: 'icons/magic/holy/angel-wings-gray.webp',
	Haunted: 'icons/creatures/magical/spirit-undead-horned-blue.webp',
	Infested: 'icons/creatures/eyes/icy-cluster-blue.webp',
	Ravaged: 'icons/environment/settlement/building-rubble.webp',
	Wild: 'icons/magic/nature/root-vines-grow-brown.webp'
} as const

const THEME_IDS = {
	Ancient: '9RnSqMcrekJoJbXH',
	Corrupted: 'pKCYCvdI2WjjKsjY',
	Fortified: 'ONZWFYrqxgFIzppP',
	Hallowed: 'zhOq6bjCvYhXkMQB',
	Haunted: '9BtnJYn9vXBGEV5R',
	Infested: 'H5aJvBKwPrbEnzMe',
	Ravaged: 'iDOVA8797p4kYar7',
	Wild: 'v3jYuNrr1Jt4TzNZ'
} as const

const DOMAIN_IMAGES = {
	Barrow: 'icons/environment/wilderness/cave-entrance-dwarven-hill.webp',
	Cavern: 'icons/environment/wilderness/cave-entrance-mountain-blue.webp',
	'Frozen Cavern': 'icons/magic/water/water-iceberg-bubbles.webp',
	Icereach: 'icons/magic/water/barrier-ice-crystal-wall-jagged-blue.webp',
	Mine: 'icons/environment/settlement/mine-cart-rocks-red.webp',
	Pass: 'icons/environment/wilderness/cave-entrance-rocky.webp',
	Ruin: 'icons/environment/wilderness/wall-ruins.webp',
	'Sea Cave': 'icons/environment/wilderness/cave-entrance-island.webp',
	Shadowfen: 'icons/environment/wilderness/cave-entrance.webp',
	Stronghold: 'icons/environment/settlement/castle.webp',
	Tanglewood: 'icons/environment/wilderness/terrain-forest-gray.webp',
	Underkeep: 'icons/environment/wilderness/mine-interior-dungeon-door.webp'
} as const

const DOMAIN_IDS = {
	Barrow: 'LIoWYBGBBMPlPNam',
	Cavern: 'QM2Y2Iop7fQ3yifB',
	'Frozen Cavern': '2c2t4chqfpZ9ydid',
	Icereach: 'hziNL2ikUkcPkd6A',
	Mine: 'HjxXUr5xrV1mobAO',
	Pass: '058BdtjZuW0pOLeE',
	Ruin: 'lkqTLuiB3g9dD7ed',
	'Sea Cave': 'jdJOGqg4DyEeCFg4',
	Shadowfen: 'Xn1xz4l3r6AMWzg8',
	Stronghold: 'Yy9KkvSOvB2tWxOp',
	Tanglewood: 'MbJlpR81C4Q4WDV2',
	Underkeep: 'vyyrG8pPtDQ6FAgG'
} as const

const PACKS = [
	'foundry-ironsworn.ironsworndelvethemes',
	'foundry-ironsworn.ironsworndelvedomains',
	'foundry-ironsworn.ironswornfoes',
	'foundry-ironsworn.foeactorsis',
	'foundry-ironsworn.ironswornoracles'
] as const

interface RawFeatureOrDanger {
	Chance: number
	Description: string
}

function importDelveFeaturesOrDangers(
	rawFeaturesOrDangers: RawFeatureOrDanger[],
	type: 'feature' | 'danger',
	sourceId: Item['id'] = null,
	low = 1
) {
	const result: DelveSiteFeatureOrDanger[] = []
	for (const featureOrDanger of rawFeaturesOrDangers) {
		result.push({
			range: [low, featureOrDanger.Chance],
			text: featureOrDanger.Description,
			flags: {
				'foundry-ironsworn': {
					type: `delve-site-${type}`,
					sourceId
				}
			}
		})
		low = featureOrDanger.Chance + 1
	}
	return result
}

export async function importFromDatasworn() {
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

	// Themes
	const themesJson = await fetch(
		'systems/foundry-ironsworn/assets/delve-themes.json'
	).then(async (x) => await x.json())
	const themesToCreate = themesJson.Themes.map((rawTheme) => {
		const _id = THEME_IDS[rawTheme.Name]
		const themeData = {
			_id,
			type: 'delve-theme',
			name: rawTheme.Name,
			img: THEME_IMAGES[rawTheme.Name],
			system: {
				summary: rawTheme.Summary,
				description: rawTheme.Description,
				features: importDelveFeaturesOrDangers(
					rawTheme.Features,
					'feature',
					_id,
					1
				),
				dangers: importDelveFeaturesOrDangers(
					rawTheme.Dangers,
					'danger',
					_id,
					1
				)
			}
		}

		return themeData
	})
	await Item.createDocuments(themesToCreate, {
		pack: 'foundry-ironsworn.ironsworndelvethemes',
		keepId: true
	})

	// Domains
	const domainsJson = await fetch(
		'systems/foundry-ironsworn/assets/delve-domains.json'
	).then(async (x) => await x.json())
	const domainsToCreate = domainsJson.Domains.map((rawDomain) => {
		const _id = DOMAIN_IDS[rawDomain.Name]
		const domainData = {
			_id,
			type: 'delve-domain',
			name: rawDomain.Name,
			img: DOMAIN_IMAGES[rawDomain.Name],
			system: {
				summary: rawDomain.Summary,
				description: rawDomain.Description,
				features: importDelveFeaturesOrDangers(
					rawDomain.Features,
					'feature',
					_id,
					21
				),
				dangers: importDelveFeaturesOrDangers(
					rawDomain.Dangers,
					'danger',
					_id,
					31
				)
			}
		}

		return domainData
	})
	await Item.createDocuments(domainsToCreate, {
		pack: 'foundry-ironsworn.ironsworndelvedomains',
		keepId: true
	})

	// Lock the packs again
	for (const key of PACKS) {
		await game.packs.get(key)?.configure({ locked: true })
	}
}
