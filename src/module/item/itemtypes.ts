import type { IMove } from 'dataforged'
import type { ChallengeRank } from '../constants'
import type { AssetDataProperties, AssetDataSource } from './subtypes/asset'
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
import { SFMoveDataProperties, SFMoveDataSource } from './subtypes/sfmove'

export interface ProgressBase {
	description: string
	rank: ChallengeRank
	current: number
	completed: boolean
}

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
