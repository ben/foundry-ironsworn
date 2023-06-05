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

export const FOE_IMAGES = {
	Broken: 'icons/creatures/mammals/humanoid-fox-cat-archer.webp',
	'Common Folk': 'icons/tools/hand/shovel-spade-steel-blue-brown.webp',
	Hunter: 'icons/environment/people/archer.webp',
	Mystic: 'icons/environment/people/cleric-orange.webp',
	Raider: 'icons/sundries/flags/banner-flag-pirate.webp',
	Warrior: 'icons/skills/melee/hand-grip-sword-red.webp',
	Husk: 'icons/magic/earth/strike-body-stone-crumble.webp',
	Zealot: 'icons/environment/people/cleric-grey.webp',
	Elf: 'icons/creatures/magical/humanoid-horned-rider.webp',
	Giant: 'icons/creatures/magical/humanoid-giant-forest-blue.webp',
	Primordial: 'icons/creatures/magical/spirit-undead-horned-blue.webp',
	Troll: 'icons/creatures/mammals/bull-horns-eyes-glowin-orange.webp',
	Varou: 'icons/creatures/mammals/wolf-shadow-black.webp',
	Atanya: 'icons/magic/air/wind-weather-sailing-ship.webp',
	Merrow: 'icons/creatures/fish/fish-man-eye-green.webp',
	Bear: 'icons/creatures/abilities/bear-roar-bite-brown-green.webp',
	Boar: 'icons/commodities/treasure/figurine-boar.webp',
	Gaunt: 'icons/magic/fire/elemental-creature-horse.webp',
	'Marsh Rat': 'icons/creatures/mammals/rodent-rat-diseaed-gray.webp',
	Wolf: 'icons/creatures/abilities/wolf-howl-moon-purple.webp',
	Bladewing: 'icons/creatures/magical/spirit-undead-winged-ghost.webp',
	'Carrion Newt':
		'icons/creatures/reptiles/chameleon-camouflage-green-brown.webp',
	'Cave Lion': 'icons/creatures/abilities/lion-roar-yellow.webp',
	'Deep Rat': 'icons/creatures/mammals/rodent-rat-green.webp',
	'Nightmare Spider':
		'icons/creatures/invertebrates/spider-mandibles-brown.webp',
	'Shroud Crab': 'icons/consumables/meat/claw-crab-lobster-serrated-pink.webp',
	Trog: 'icons/creatures/reptiles/lizard-iguana-green.webp',
	Basilisk: 'icons/creatures/reptiles/snake-poised-white.webp',
	'Elder Beast':
		'icons/creatures/mammals/beast-horned-scaled-glowing-orange.webp',
	'Harrow Spider': 'icons/creatures/invertebrates/spider-web-black.webp',
	Leviathan: 'icons/creatures/reptiles/serpent-horned-green.webp',
	Mammoth: 'icons/commodities/leather/fur-white.webp',
	Wyvern: 'icons/creatures/abilities/wolf-heads-swirl-purple.webp',
	Chitter: 'icons/creatures/invertebrates/bug-sixlegged-gray.webp',
	Gnarl: 'icons/magic/nature/tree-animated-strike.webp',
	'Iron-Wracked Beast': 'icons/environment/wilderness/statue-hound-horned.webp',
	Kraken: 'icons/creatures/fish/squid-kraken-orange.webp',
	Nightspawn: 'icons/creatures/unholy/demon-horned-black-yellow.webp',
	Rhaskar: 'icons/creatures/fish/fish-marlin-swordfight-blue.webp',
	Wyrm: 'icons/creatures/eyes/lizard-single-slit-pink.webp',
	Bonewalker: 'icons/magic/death/undead-skeleton-worn-blue.webp',
	Frostbound: 'icons/creatures/magical/spirit-undead-ghost-blue.webp',
	Chimera: 'icons/creatures/magical/spirit-earth-stone-magma-yellow.webp',
	Haunt: 'icons/magic/death/undead-ghost-strike-white.webp',
	Hollow: 'icons/consumables/plants/grass-leaves-green.webp',
	'Iron Revenant': 'icons/creatures/magical/construct-golem-stone-blue.webp',
	Sodden: 'icons/magic/death/undead-ghost-scream-teal.webp',
	Blighthound: 'icons/commodities/treasure/figurine-dog.webp',
	'Bog Rot': 'icons/magic/death/hand-dirt-undead-zombie.webp',
	Bonehorde: 'icons/skills/trades/academics-study-archaeology-bones.webp',
	Thrall: 'icons/creatures/abilities/mouth-teeth-human.webp',
	Wight: 'icons/creatures/magical/humanoid-silhouette-green.webp',
	'Blood Thorn': 'icons/consumables/plants/thorned-stem-vine-green.webp',
	'Circle of Stones': 'icons/environment/wilderness/arch-stone.webp',
	Glimmer: 'icons/magic/nature/elemental-plant-humanoid.webp',
	Gloom: 'icons/magic/perception/silhouette-stealth-shadow.webp',
	Maelstrom: 'icons/magic/water/vortex-water-whirlpool.webp',
	Tempest: 'icons/magic/lightning/bolts-salvo-clouds-sky.webp'
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
interface RawThemeOrDomain {
	Name: keyof typeof THEME_IDS | keyof typeof DOMAIN_IDS
	Summary: string
	Description: string
	Features: RawFeatureOrDanger[]
	Dangers: RawFeatureOrDanger[]
}

function importDelveFeaturesOrDangers(
	rawFeaturesOrDangers: RawFeatureOrDanger[],
	type: 'feature' | 'danger',
	sourceId: Item['uuid'],
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
	let pack: ValueOf<typeof PACKS> = 'foundry-ironsworn.ironsworndelvethemes'
	const themesJson = await fetch(
		'systems/foundry-ironsworn/assets/delve-themes.json'
	).then(async (x) => await x.json())
	const themesToCreate = (themesJson.Themes as RawThemeOrDomain[]).map(
		(rawTheme) => {
			const _id = THEME_IDS[rawTheme.Name as keyof typeof THEME_IDS]
			const uuid = `${pack}.${_id}`

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
						uuid,
						1
					),
					dangers: importDelveFeaturesOrDangers(
						rawTheme.Dangers,
						'danger',
						uuid,
						1
					)
				}
			}

			return themeData
		}
	)
	// @ts-expect-error until v10 types are available
	await Item.createDocuments(themesToCreate, {
		pack,
		keepId: true
	})

	// Domains
	pack = 'foundry-ironsworn.ironsworndelvedomains'
	const domainsJson = await fetch(
		'systems/foundry-ironsworn/assets/delve-domains.json'
	).then(async (x) => await x.json())
	const domainsToCreate = (domainsJson.Domains as RawThemeOrDomain[]).map(
		(rawDomain) => {
			const _id = DOMAIN_IDS[rawDomain.Name as keyof typeof DOMAIN_IDS]
			const uuid = `${pack}.${_id}`

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
						uuid,
						21
					),
					dangers: importDelveFeaturesOrDangers(
						rawDomain.Dangers,
						'danger',
						uuid,
						31
					)
				}
			}

			return domainData
		}
	)
	// @ts-expect-error until v10 types are available
	await Item.createDocuments(domainsToCreate, {
		pack,
		keepId: true
	})

	// Lock the packs again
	for (const key of PACKS) {
		await game.packs.get(key)?.configure({ locked: true })
	}
}
