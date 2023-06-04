import type { ChallengeRank } from '../constants'
import type { AssetDataProperties, AssetDataSource } from './subtypes/asset'
import type {
	BondsetDataProperties,
	BondsetDataSource
} from './subtypes/bondset'
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
import type { SFMoveDataProperties, SFMoveDataSource } from './subtypes/sfmove'

export interface ProgressBase {
	description: string
	rank: ChallengeRank
	current: number
	completed: boolean
}

/// ////////////////////////////

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
