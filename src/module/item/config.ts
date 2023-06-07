import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { PartialDeep } from 'dataforged'
import { IronswornItem } from './item'
import { AssetData } from './subtypes/asset'
import { BondsetData } from './subtypes/bondset'
import { DelveDomainData } from './subtypes/delve-domain'
import { DelveThemeData } from './subtypes/delve-theme'
import { ProgressData } from './subtypes/progress'
import { SFMoveData } from './subtypes/sfmove'
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

const dataModels: Partial<
	Record<
		ConfiguredData<'Item'>['type'],
		typeof foundry.abstract.TypeDataModel<any, any>
	>
> = {
	'delve-theme': DelveThemeData,
	'delve-domain': DelveDomainData,
	progress: ProgressData,
	asset: AssetData,
	sfmove: SFMoveData,
	bondset: BondsetData
}

type ItemType = ConfiguredData<'Item'>['type']
// v11+ uses 'dataModels' instead
type _itemConfig = Omit<(typeof CONFIG)['Item'], 'systemDataModels'> & {
	dataModels: (typeof CONFIG)['Item']['systemDataModels']

	typeLabels: Record<ItemType, string>
	typeIcons: Record<ItemType, string>
}

export interface ItemConfig extends _itemConfig {
	dataModels: Record<ItemType, typeof foundry.abstract.TypeDataModel<any, any>>
	typeLabels: Record<ItemType, string>
	typeIcons: Record<ItemType, string>
}

const config: PartialDeep<ItemConfig> = {
	documentClass: IronswornItem,
	dataModels,
	typeLabels: {
		asset: 'IRONSWORN.ITEM.TypeAsset',
		progress: 'IRONSWORN.ITEM.TypeProgressTrack',
		bondset: 'IRONSWORN.ITEM.TypeBondset',
		sfmove: 'IRONSWORN.ITEM.TypeMove',
		'delve-domain': 'IRONSWORN.ITEM.TypeDelveDomain',
		'delve-theme': 'IRONSWORN.ITEM.TypeDelveTheme'
	},
	typeIcons: {
		asset: 'fa-solid fa-cards-blank',
		progress: 'fa-solid fa-asterisk',
		bondset: 'fa-solid fa-handshake',
		sfmove: 'icon isicon-d10-tilt',
		// FIXME ideally, these would be distinct from assets, but all three card types are abstract enough than an icon is tricky
		'delve-domain': 'fa-duotone fa-cards-blank',
		'delve-theme': 'fa-duotone fa-cards-blank'
	}
} as const

export default config

export interface ProgressBase {
	description: string
	rank: ChallengeRank
	current: number
	completed: boolean
}

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
