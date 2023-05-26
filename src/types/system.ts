import type {
	COMPENDIUM_DOCUMENT_TYPES,
	PACKAGE_TYPES
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'
import type { SortingModes } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import { BaseFolder } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents.mjs'
import {
	PackageData,
	PackageDataProperties
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs/packageData'

/**
 * A custom SchemaField for defining the folder structure of the included compendium packs.
 */
export interface PackageCompendiumFolder {
	name: string
	sorting?: SortingModes
	color?: string
	packs?: string[]
	folders?: PackageCompendiumFolder[]
}
/**
 * A custom SchemaField for defining a related Package.
 * It may be required to be a specific type of package, by passing the packageType option to the constructor.
 */
export interface RelatedPackage {
	/** The id of the related package */
	id: string
	/** The type of the related package */
	type: PACKAGE_TYPES
	/** An explicit manifest URL, otherwise learned from the Foundry web server */
	manifest?: string
	/** The compatibility data with this related Package */
	compatibility?: PackageCompatibility
	/** The reason for this relationship */
	reason?: string
}

export interface PackageCompatibility {
	minimum?: string | number
	verified?: string | number
	maximum?: string | number
}

/**
 * The data structure of a package manifest. This data structure is extended by BasePackage subclasses to add additional
 * type-specific fields.
 * [[include:full-manifest.md]]
 */
export interface PackageManifestData {
	/** The machine-readable unique package id, should be lower-case with no spaces or special characters */
	id: string
	/**  The human-readable package title, containing spaces and special characters */
	title: string
	/** An optional package description, may contain HTML */
	description?: string
	/** An array of author objects who are co-authors of this package. Preferred to the singular author field. */
	authors?: PackageAuthorData[]
	/** A web url where more details about the package may be found */
	url?: string
	/** A web url or relative file path where license details may be found */
	license?: string
	/** A web url or relative file path where readme instructions may be found */
	readme?: string
	/** A web url where bug reports may be submitted and tracked */
	bugs?: string
	/** A web url where notes detailing package updates are available */
	changelog?: string
	/** The current package version */
	version: string
	/** The compatibility of this version with the core Foundry software */
	compatibility?: PackageCompatibility
	/** An array of urls or relative file paths for JavaScript files which should be included */
	scripts?: string[]
	/** An array of urls or relative file paths for ESModule files which should be included */
	esmodules?: string[]
	/** An array of urls or relative file paths for CSS stylesheet files which should be included */
	styles?: string[]
	/** An array of compendium packs which are included by this package */
	languages?: PackageLanguageData[]
	/** An organized object of relationships to other Packages */
	relationships?: PackageRelationships
	/** Whether to require a package-specific socket namespace for this package */
	socket?: boolean
	/** A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates. */
	manifest?: string
	/** A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation. */
	download?: string
	/**
	 * Whether this package uses the protected content access system.
	 * @default false
	 */
	protected?: boolean

	flags?: Record<string, unknown>
	media?: PackageManifestMedia[]
	packs?: PackageManifestPack[]
	packFolders?: PackageCompendiumFolder[]
	exclusive?: boolean
	persistentStorage?: boolean
}

export interface PackageManifestPack {
	name: string
	label: string
	banner?: string
	path?: string
	type: COMPENDIUM_DOCUMENT_TYPES
	system?: string
	ownership?: CompendiumOwnership
	flags?: Record<string, unknown>
}

export interface CompendiumOwnership {}

export interface PackageManifestMedia {
	type?: string
	url?: string
	caption?: string
	/** @default false */
	loop?: boolean
	thumbnail?: string
	flags?: Record<string, unknown>
}

export interface PackageAuthorData extends Record<string, unknown> {
	/** The author name */
	name: string
	/** The author email address */
	email?: string
	/** A website url for the author */
	url?: string
	/** A Discord username for the author */
	discord?: string
	flags?: Record<string, unknown>
}
export interface PackageLanguageData {
	/**
	 * @typedef {Object} PackageLanguageData
	 * @property {string} lang        A string language code which is validated by Intl.getCanonicalLocales
	 * @property {string} name        The human-readable language name
	 * @property {string} path        The relative path to included JSON translation strings
	 * @property {string} [system]    Only apply this set of translations when a specific system is being used
	 * @property {string} [module]    Only apply this set of translations when a specific module is active
	 */
	/** A string language code which is validated by Intl.getCanonicalLocales */
	lang: string
	/** The human-readable language name */
	name: string
	/** The relative path to included JSON translation strings */
	path: string
	/** Only apply this set of translations when a specific system is being used */
	system?: string
	/**  Only apply this set of translations when a specific module is active */
	module?: string
}

export interface PackageRelationships {
	/** Systems that this Package supports */
	systems?: RelatedPackage[]
	/** Packages that are required for base functionality */
	requires?: RelatedPackage[]
	/** Packages that are recommended for optimal functionality */
	recommends?: RelatedPackage[]
	conflicts?: RelatedPackage[]
	flags?: Record<string, unknown>
}

export interface PackageCompendiumData {
	/** The canonical compendium name. This should contain no spaces or special characters */
	name: string
	/** The human-readable compendium name */
	label: string
	/** The local relative path to the compendium source directory. The filename should match the name attribute */
	path: string
	/** The specific document type that is contained within this compendium pack */
	type: COMPENDIUM_DOCUMENT_TYPES
	/** Denote that this compendium pack requires a specific game system to function properly */
	system?: string
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
export interface SystemManifestData extends PackageManifestData {
	/**
	 * A web URL or local file path which provides a default background banner for worlds which are created using this system */
	background?: string
	/** A default initiative formula used for this system */
	initiative?: string
	/** A default distance measurement to use for Scenes in this system */
	gridDistance?: number
	/** A default unit of measure to use for distance measurement in this system */
	gridUnits?: string
	/** An Actor data attribute path to use for Token primary resource bars */
	primaryTokenAttribute?: string
	/** An Actor data attribute path to use for Token secondary resource bars */
	secondaryTokenAttribute?: string
}

const system: SystemManifestData = {
	id: 'foundry-ironsworn',
	title: 'Ironsworn & Starforged',
	description:
		'An implementation of the Ironsworn and Starforged systems, by Shawn Tomkin.',
	license: 'LICENSE.txt',
	version: '1.21.6',
	url: 'https://github.com/ben/foundry-ironsworn',
	manifest:
		'https://github.com/ben/foundry-ironsworn/releases/latest/download/system.json',
	download:
		'https://github.com/ben/foundry-ironsworn/releases/download/1.21.6/ironsworn.zip',
	compatibility: {
		minimum: 11,
		verified: 11
	},
	authors: [
		{
			name: 'Ben Straub',
			url: 'https://ben.straub.cc',
			email: 'ben@straub.cc',
			discord: 'benstraub#3706',
			reddit: 'u/ben_straub',
			twitter: '@benstraub'
		}
	],
	media: [
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196736998-be31c65c-808e-48af-8952-7e4f35c1cafd.jpg',
			caption: 'Ironsworn character sheet'
		},
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196737008-e2c3156f-5279-4bce-ba33-94feeb6a6f2d.jpg',
			caption: 'Ironsworn gameplay'
		},
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196737021-a49b4d3e-eb47-40c8-b56e-b4bcdd96bf03.jpg',
			caption: 'Delve site and shared sheets'
		},
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196737029-da568b95-cb6a-491e-99f4-eb93eb977f4b.jpg',
			caption: 'Starforged gameplay'
		},
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196737036-155657a7-2e4a-4b0a-beec-f4be2b2465e2.jpg',
			caption: 'Starforged assets and oracles'
		},
		{
			type: 'screenshot',
			url: 'https://user-images.githubusercontent.com/39902/196737041-eb274d52-ac65-4f5e-a6d5-01dac1040d5e.jpg',
			caption: 'Starforged locations'
		},
		{
			type: 'cover',
			url: 'https://user-images.githubusercontent.com/39902/196740415-92c25bb7-d116-4afc-a599-fc1920e143a5.jpg',
			caption: 'Ironsworn & Starforged'
		}
	],
	esmodules: ['ironsworn.js'],
	styles: ['ironsworn.css'],
	relationships: {
		requires: [],
		conflicts: [],
		recommends: []
	},
	packFolders: [
		{
			name: 'Ironsworn Core Rulebook',
			packs: [
				'foeactorsis',
				'ironswornoracles',
				'ironswornmoves',
				'ironswornassets',
				'ironswornfoes',
				'ironswornscenes'
			]
		},
		{
			name: 'Ironsworn: Delve',
			packs: ['ironsworndelvethemes', 'ironsworndelvedomains', 'delve-oracles']
		},
		{
			name: 'Starforged Core Rulebook',
			packs: [
				'foeactorssf',
				'starforged-sectors',
				'starforgedassets',
				'starforgedencounters',
				'starforgedmoves',
				'starforgedoracles',
				'starforgedtruths'
			]
		}
	],
	packs: [
		{
			name: 'foeactorsis',
			label: 'Ironsworn Foe Actors',
			system: 'foundry-ironsworn',
			path: 'packs/foe-actors-is.db',
			type: 'Actor'
		},
		{
			name: 'foeactorssf',
			label: 'Starforged Foe Actors',
			system: 'foundry-ironsworn',
			path: 'packs/foe-actors-sf.db',
			type: 'Actor'
		},
		{
			name: 'ironswornoracles',
			label: 'Ironsworn Oracles',
			system: 'foundry-ironsworn',
			path: 'packs/ironsworn-oracles.db',
			type: 'RollTable'
		},
		{
			name: 'delve-oracles',
			label: 'Ironsworn: Delve oracles',
			system: 'foundry-ironsworn',
			path: 'packs/delve-oracles.db',
			type: 'RollTable'
		},
		{
			name: 'ironswornmoves',
			label: 'Ironsworn Moves',
			system: 'foundry-ironsworn',
			path: 'packs/ironsworn-moves.db',
			type: 'Item'
		},
		{
			name: 'ironswornassets',
			label: 'Ironsworn Assets',
			system: 'foundry-ironsworn',
			path: 'packs/assets.db',
			type: 'Item'
		},
		{
			name: 'ironsworndelvethemes',
			label: 'Ironsworn Delve Themes',
			system: 'foundry-ironsworn',
			path: 'packs/delve-themes.db',
			type: 'Item'
		},
		{
			name: 'ironsworndelvedomains',
			label: 'Ironsworn Delve Domains',
			system: 'foundry-ironsworn',
			path: 'packs/delve-domains.db',
			type: 'Item'
		},
		{
			name: 'ironswornfoes',
			label: 'Ironsworn Foes',
			system: 'foundry-ironsworn',
			path: 'packs/foes.db',
			type: 'Item'
		},
		{
			name: 'ironswornscenes',
			label: 'Ironsworn Maps',
			system: 'foundry-ironsworn',
			path: 'packs/scenes.db',
			type: 'Scene'
		},
		{
			name: 'starforged-sectors',
			label: 'Starforged Scenes',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-sectors.db',
			type: 'Scene'
		},
		{
			name: 'starforgedassets',
			label: 'Starforged Assets',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-assets.db',
			type: 'Item'
		},
		{
			name: 'starforgedencounters',
			label: 'Starforged Encounters',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-encounters.db',
			type: 'Item'
		},
		{
			name: 'starforgedmoves',
			label: 'Starforged Moves',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-moves.db',
			type: 'Item'
		},
		{
			name: 'starforgedoracles',
			label: 'Starforged Oracles',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-oracles.db',
			type: 'RollTable'
		},
		{
			name: 'starforgedtruths',
			label: 'Starforged Setting Truths',
			system: 'foundry-ironsworn',
			path: 'packs/starforged-truths.db',
			type: 'JournalEntry'
		},
		{
			name: 'macros',
			label: 'Ironsworn Macros',
			system: 'foundry-ironsworn',
			path: 'packs/macros.db',
			type: 'Macro'
		}
	],
	languages: [
		{
			lang: 'en',
			name: 'English',
			path: 'lang/en.json'
		},
		{
			lang: 'de',
			name: 'Deutsch',
			path: 'lang/de.json'
		},
		{
			lang: 'es',
			name: 'Español',
			path: 'lang/es.json'
		},
		{
			lang: 'pl',
			name: 'Polski',
			path: 'lang/pl.json'
		},
		{
			lang: 'fr',
			name: 'Français',
			path: 'lang/fr.json'
		}
	]
}
