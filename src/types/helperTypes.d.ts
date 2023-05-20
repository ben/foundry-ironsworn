import { ConfiguredDocumentClassOrDefault } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/config'
import {
	ConfiguredData,
	ConfiguredDocumentClassForName
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import DataModel from '../foundry/common/abstract/data.mjs'
import Document, { Metadata } from '../foundry/common/abstract/document.mjs'
import type { SubTypeShape } from './config.js'

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T

export type DataModelConstructor = Pick<
	typeof DataModel,
	keyof typeof DataModel
> &
	(new (...args: any[]) => Document<any, any, any, any>)

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> &
	(new (...args: any[]) => Document<any, any, any, any>)

export type PlaceableObjectConstructor = Pick<
	typeof PlaceableObject,
	keyof typeof PlaceableObject
> &
	(new (...args: any[]) => PlaceableObject<any>)

export type ConfiguredDocumentClass<T extends DocumentConstructor> =
	ConfiguredDocumentClassForName<T['metadata']['name']>

export type SystemDocumentType = Extract<
	DocumentType,
	// these can get configured subtypes, but this system doesn't use them right now
	// | 'Card'
	// | 'Cards'
	'Actor' | 'Item' | 'JournalEntryPage'
>

export type SystemDocument = ConfiguredDocumentClassForName<SystemDocumentType>

export type SystemTypeData<
	T extends SystemDocumentType,
	U extends DocumentSubTypes<T>
> = U extends 'base' ? Record<string, unknown> : ConfiguredData<T>

export type DocumentSubTypes<T extends DocumentType> =
	T extends SystemDocumentType
		? ConfiguredData<T>['type']
		: typeof foundry.CONST.BASE_DOCUMENT_TYPE

export type DocumentType =
	| 'Actor'
	| 'Adventure'
	| 'Cards'
	| 'ChatMessage'
	| 'Combat'
	| 'FogExploration'
	| 'Folder'
	| 'Item'
	| 'JournalEntry'
	| 'JournalEntryPage'
	| 'Macro'
	| 'Playlist'
	| 'RollTable'
	| 'Scene'
	| 'Setting'
	| 'User'
	| 'ActiveEffect'
	| 'Card'
	| 'TableResult'
	| 'PlaylistSound'
	| 'AmbientLight'
	| 'AmbientSound'
	| 'Combatant'
	| 'Drawing'
	| 'MeasuredTemplate'
	| 'Note'
	| 'Tile'
	| 'Token'
	| 'Wall'

export type PlaceableDocumentType =
	| 'AmbientLight'
	| 'AmbientSound'
	| 'Drawing'
	| 'MeasuredTemplate'
	| 'Note'
	| 'Tile'
	| 'Token'
	| 'Wall'
