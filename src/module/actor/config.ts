import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { IronswornActor } from './actor'
import type {
	CharacterDataProperties,
	CharacterDataSource
} from './subtypes/character'
import { CharacterData } from './subtypes/character'
import type { FoeDataProperties, FoeDataSource } from './subtypes/foe'
import { FoeData } from './subtypes/foe'
import type {
	LocationDataProperties,
	LocationDataSource
} from './subtypes/location'
import { LocationData } from './subtypes/location'
import type { SharedDataProperties, SharedDataSource } from './subtypes/shared'
import { SharedData } from './subtypes/shared'
import type { SiteDataProperties, SiteDataSource } from './subtypes/site'
import { SiteData } from './subtypes/site'
import type {
	StarshipDataProperties,
	StarshipDataSource
} from './subtypes/starship'
import { StarshipData } from './subtypes/starship'

const dataModels: Record<
	ConfiguredData<'Actor'>['type'],
	typeof foundry.abstract.TypeDataModel<any, any>
> = {
	character: CharacterData,
	foe: FoeData,
	location: LocationData,
	shared: SharedData,
	site: SiteData,
	starship: StarshipData
}

type ActorType = ConfiguredData<'Actor'>['type']
// v11+ uses 'dataModels' instead
type _actorConfig = Omit<(typeof CONFIG)['Actor'], 'systemDataModels'> & {
	dataModels: (typeof CONFIG)['Actor']['systemDataModels']
}

export interface ActorConfig extends _actorConfig {
	dataModels: Record<ActorType, typeof foundry.abstract.TypeDataModel<any, any>>
	typeLabels: Record<ActorType, string>
	typeIcons: Record<ActorType, string>
}

const config: Partial<ActorConfig> = {
	documentClass: IronswornActor,
	dataModels,
	typeLabels: {
		character: 'IRONSWORN.ACTOR.TypeCharacter',
		foe: 'IRONSWORN.ACTOR.TypeFoe',
		location: 'IRONSWORN.ACTOR.TypeLocation',
		shared: 'IRONSWORN.ACTOR.TypeShared',
		site: 'IRONSWORN.ACTOR.TypeDelveSite',
		starship: 'IRONSWORN.ACTOR.TypeStarship'
	},
	typeIcons: {
		character: 'fa-solid fa-user-pen',
		foe: 'fa-solid fa-masks-theater',
		location: 'fa-solid fa-location-dot',
		shared: 'fa-solid fa-people-group',
		site: 'fa-solid fa-dungeon',
		starship: 'fa-solid fa-starship-freighter'
	}
} as const

export default config

export {
	CharacterData,
	FoeData,
	LocationData,
	SharedData,
	SiteData,
	StarshipData
}

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

	interface FlagConfig {
		Actor: {
			core: { sheetClass: string }
			'foundry-ironsworn'?: { muteBroadcast?: boolean; 'edit-mode'?: boolean }
		}
	}
}
