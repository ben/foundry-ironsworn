import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { ChallengeRank } from '../constants'

interface CharacterDataSourceData {
	biography: string
	notes: string
	edge: number
	heart: number
	iron: number
	shadow: number
	wits: number
	health: number
	spirit: number
	supply: number
	experience: number
	momentum: number
	momentumReset: number
	momentumMax: number
	debility: {
		corrupted: boolean
		cursed: boolean
		encumbered: boolean
		maimed: boolean
		shaken: boolean
		tormented: boolean
		unprepared: boolean
		wounded: boolean
		permanentlyharmed: boolean
		traumatized: boolean
		doomed: boolean
		indebted: boolean
		battered: boolean
		custom1: boolean
		custom1name: string
		custom2: boolean
		custom2name: string
	}
	legacies: {
		quests: number
		questsXpSpent: number
		bonds: number
		bondsXpSpent: number
		discoveries: number
		discoveriesXpSpent: number
	}
	xp: number
}

export interface CharacterDataPropertiesData extends CharacterDataSourceData {
	momentumMax: number
	momentumReset: number
}

export interface CharacterDataProperties {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: CharacterDataPropertiesData
	system: CharacterDataPropertiesData
}

export interface CharacterDataSource {
	type: 'character'
	/**
	 * @deprecated
	 */
	data: CharacterDataSourceData
	system: CharacterDataSourceData
}

/// /////////////////////////////////////

interface SharedDataSourceData {
	biography: string
	supply: number
}
export type SharedDataPropertiesData = SharedDataSourceData

interface SharedDataSource {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: SharedDataSourceData
	system: SharedDataSourceData
}
export interface SharedDataProperties {
	type: 'shared'
	/**
	 * @deprecated
	 */
	data: SharedDataPropertiesData
	system: SharedDataPropertiesData
}

/// /////////////////////////////////////

interface FoeDataSourceData {
	dfid?: string
	description?: string
}
type FoeDataPropertiesData = FoeDataSourceData

export interface FoeDataSource {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: FoeDataSourceData
	system: FoeDataSourceData
}
export interface FoeDataProperties {
	type: 'foe'
	/**
	 * @deprecated
	 */
	data: FoeDataPropertiesData
	system: FoeDataPropertiesData
}

/// /////////////////////////////////////

/**
 * Represents an entry in the delve site denizen matrix.
 */
export interface DelveSiteDenizen extends TableResultDataConstructorData {}

export interface SiteDataSourceData {
	objective: string
	description: string
	notes: string
	rank: ChallengeRank
	current: number
	denizens: DelveSiteDenizen[]
}
export type SiteDataPropertiesData = SiteDataSourceData

export interface SiteDataSource {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteDataSourceData
	system: SiteDataSourceData
}
export interface SiteDataProperties {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteDataPropertiesData
	system: SiteDataPropertiesData
}

/// /////////////////////////////////////

interface StarshipDataSourceData {
	health: number
	debility: {
		battered: boolean
		cursed: boolean
	}
}
export type StarshipDataPropertiesData = StarshipDataSourceData

export interface StarshipDataSource {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: StarshipDataSourceData
	system: StarshipDataSourceData
}
export interface StarshipDataProperties {
	type: 'starship'
	/**
	 * @deprecated
	 */
	data: StarshipDataPropertiesData
	system: StarshipDataPropertiesData
}

/// /////////////////////////////////////

interface LocationDataSourceData {
	subtype: string
	klass: string
	description: string
}
type LocationDataPropertiesData = LocationDataSourceData

export interface LocationDataSource {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationDataSourceData
	system: LocationDataSourceData
}
export interface LocationDataProperties {
	type: 'location'
	/**
	 * @deprecated
	 */
	data: LocationDataPropertiesData
	system: LocationDataPropertiesData
}

/// /////////////////////////////////////

export type ActorDataSource =
	| CharacterDataSource
	| SharedDataSource
	| FoeDataSource
	| SiteDataSource
	| StarshipDataSource
	| LocationDataSource
export type ActorDataProperties =
	| CharacterDataProperties
	| SharedDataProperties
	| FoeDataProperties
	| SiteDataProperties
	| StarshipDataProperties
	| LocationDataProperties

declare global {
	interface SourceConfig {
		Actor: ActorDataSource
	}

	interface DataConfig {
		Actor: ActorDataProperties
	}
}
