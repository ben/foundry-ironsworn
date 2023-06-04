import type { IMove } from 'dataforged'
import type { ChallengeRank } from '../constants'
import type {
	DelveDomainDataProperties,
	DelveDomainDataSource
} from './subtypes/delve-domain'
import type {
	DelveThemeDataProperties,
	DelveThemeDataSource
} from './subtypes/delve-theme'
import type {
	ProgressDataProperties,
	ProgressDataSource
} from './subtypes/progress'

export interface ProgressBase {
	description: string
	rank: ChallengeRank
	current: number
	completed: boolean
}

/// ////////////////////////////

export interface AssetField {
	name: string
	value: string
}

export interface AssetAbility {
	name?: string
	enabled: boolean
	description: string
	hasClock: boolean
	clockMax: number
	clockTicks: number
}

interface AssetExclusiveOption {
	name: string
	selected: boolean
}

interface AssetCondition {
	name: string
	ticked: boolean
}

interface AssetDataSourceData {
	category: string
	description?: string
	requirement: string
	color: string
	fields: AssetField[]
	abilities: AssetAbility[]
	track: {
		enabled: boolean
		name: string
		current: number
		max: number
	}
	exclusiveOptions: AssetExclusiveOption[]
	conditions: AssetCondition[]
}

export interface AssetDataPropertiesData extends AssetDataSourceData {}

export interface AssetDataSource {
	type: 'asset'
	data: AssetDataSourceData
	system: AssetDataSourceData
}

export interface AssetDataProperties {
	type: 'asset'
	data: AssetDataPropertiesData
	system: AssetDataPropertiesData
}

/// ////////////////////////////

/// ////////////////////////////

interface Bond {
	name: string
	notes: string
}

interface BondsetDataSourceData {
	bonds: Bond[]
}
export interface BondsetDataPropertiesData extends BondsetDataSourceData {}

export interface BondsetDataSource {
	type: 'bondset'
	data: BondsetDataSourceData
	system: BondsetDataSourceData
}
export interface BondsetDataProperties {
	type: 'bondset'
	data: BondsetDataPropertiesData
	system: BondsetDataPropertiesData
}

/// ////////////////////////////

/// ////////////////////////////

export interface SFMoveDataPropertiesData extends IMove {
	dfid: string
}

export interface SFMoveDataSource {
	type: 'sfmove'
	data: SFMoveDataPropertiesData
	system: SFMoveDataPropertiesData
}
export interface SFMoveDataProperties {
	type: 'sfmove'
	data: SFMoveDataPropertiesData
	system: SFMoveDataPropertiesData
}

/// ////////////////////////////

export type ItemDataSource =
	| AssetDataSource
	| ProgressDataSource
	| BondsetDataSource
	| SFMoveDataSource
	| DelveThemeDataSource
	| DelveDomainDataSource
export type ItemDataProperties =
	| AssetDataProperties
	| ProgressDataProperties
	| BondsetDataProperties
	| SFMoveDataProperties
	| DelveThemeDataProperties
	| DelveDomainDataProperties

declare global {
	interface SourceConfig {
		Item: ItemDataSource
	}

	interface DataConfig {
		Item: ItemDataProperties
	}
}
