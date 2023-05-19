import { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { IronswornActor } from './actor'
import type {
	CharacterDataProperties,
	CharacterDataSource
} from './subtypes/CharacterData'
import { CharacterData } from './subtypes/CharacterData'
import type { FoeDataProperties, FoeDataSource } from './subtypes/FoeData'
import { FoeData } from './subtypes/FoeData'
import type {
	LocationDataProperties,
	LocationDataSource
} from './subtypes/LocationData'
import { LocationData } from './subtypes/LocationData'
import type {
	SharedDataProperties,
	SharedDataSource
} from './subtypes/SharedData'
import { SharedData } from './subtypes/SharedData'
import type { SiteDataProperties, SiteDataSource } from './subtypes/SiteData'
import { SiteData } from './subtypes/SiteData'
import type {
	StarshipDataProperties,
	StarshipDataSource
} from './subtypes/StarshipData'
import { StarshipData } from './subtypes/StarshipData'

const systemDataModels: Record<
	ConfiguredData<'Actor'>['type'],
	typeof foundry.abstract.DataModel<any, any>
> = {
	character: CharacterData,
	foe: FoeData,
	location: LocationData,
	shared: SharedData,
	site: SiteData,
	starship: StarshipData
}

type ActorType = ConfiguredData<'Actor'>['type']
type _actorConfig = (typeof CONFIG)['Actor']

export interface ActorConfig extends _actorConfig {
	systemDataModels: Record<
		ActorType,
		typeof foundry.abstract.DataModel<any, any>
	>
	typeLabels: Record<ActorType, string>
	typeIcons: Record<ActorType, string>
}

const config: Partial<ActorConfig> = {
	documentClass: IronswornActor,
	systemDataModels,
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
