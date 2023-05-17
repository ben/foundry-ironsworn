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
	'Actor' | 'Card' | 'Cards' | 'Item' | 'JournalEntryPage'
>

export type SystemDocument<T extends SystemDocumentType = SystemDocumentType> =
	ConfiguredDocumentClassForName<T> & { documentName: T }

export type SystemTypeData<
	T extends SystemDocument<SystemDocumentType> = SystemDocument<SystemDocumentType>,
	U extends DocumentSubTypes<T['documentName']> = DocumentSubTypes<
		T['documentName']
	>
> = U extends string
	? ConfiguredData<T extends SystemDocument<infer X> ? X : never> & { type: U }
	: Record<string, unknown>

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

export type DocumentSubTypes<T extends DocumentType> =
	T extends SystemDocumentType
		? ConfiguredDocumentClassForName<T>
		: typeof foundry.CONST.BASE_DOCUMENT_TYPE
