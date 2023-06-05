/** Package manifest types for FVTT v11 */
import type {
	COMPENDIUM_DOCUMENT_TYPES,
	PACKAGE_TYPES
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/constants.mjs'

export type SortingModes = 'a' | 'm'

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
