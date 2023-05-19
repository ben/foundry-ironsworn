import type { FieldToData } from '../fields/utils'
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

export const systemDataModels = {
	character: CharacterData,
	foe: FoeData,
	location: LocationData,
	shared: SharedData,
	site: SiteData,
	starship: StarshipData
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
}
