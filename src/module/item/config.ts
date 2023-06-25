import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { PartialDeep } from 'dataforged'
import { IronswornItem } from './item'
import { AssetModel } from './subtypes/asset'
import { BondsetModel } from './subtypes/bondset'
import { DelveDomainModel } from './subtypes/delve-domain'
import { DelveThemeModel } from './subtypes/delve-theme'
import { ProgressModel } from './subtypes/progress'
import { SFMoveModel } from './subtypes/sfmove'
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
import { ChallengeRank } from '../fields/ChallengeRank'

const dataModels: Partial<
	Record<
		ConfiguredData<'Item'>['type'],
		typeof foundry.abstract.TypeDataModel<any, any>
	>
> = {
	'delve-theme': DelveThemeModel,
	'delve-domain': DelveDomainModel,
	progress: ProgressModel,
	asset: AssetModel,
	sfmove: SFMoveModel,
	bondset: BondsetModel
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
}

export default config

export interface ProgressBase {
	description: string
	rank: ChallengeRank.Value
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

	interface FlagConfig {
		Item: {
			'foundry-ironsworn'?: {
				expanded?: boolean
				muteBroadcast?: boolean
				'edit-mode'?: boolean
			}
		}
	}
}
