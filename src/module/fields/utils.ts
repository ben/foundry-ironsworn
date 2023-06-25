/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import type { ConfiguredSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { cloneDeep, mapValues } from 'lodash-es'
import type { DocumentSubTypes, SystemDocument } from '../../types/helperTypes'
import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'

export function Partial<
	T extends Record<string, foundry.data.fields.DataField.Any>
>(data: T) {
	const newSchema = cloneDeep(data)
	return mapValues(newSchema, (v) => (v.required = false))
}

export function enumEntries<T extends Record<any, unknown>>(enumLike: T) {
	const values = Object.values(enumLike).filter(
		(x) => !isNaN(+(x as number | string))
	) as Array<T[keyof T]>
	return values.map((v) => [enumLike[v], v]) as Array<[keyof T, T[keyof T]]>
}

export function enumKeys<T extends Record<any, unknown>>(
	enumLike: T
): Array<keyof T> {
	return enumEntries(enumLike).map(([k]) => k)
}

export function enumValues<T extends Record<any, unknown>>(
	enumLike: T
): Array<T[keyof T]> {
	return enumEntries(enumLike).map(([_, v]) => v)
}

export type FieldToSource<T extends foundry.data.fields.DataField.Any> =
	T extends foundry.data.fields.DataField<infer U> ? U : never

export type SchemaToSource<
	T extends Record<string, foundry.data.fields.DataField.Any>
> = {
	[K in keyof T]: FieldToSource<T[K]>
}

declare global {
	export type ItemSource<
		T extends DocumentSubTypes<'Item'> = DocumentSubTypes<'Item'>
	> = ReturnType<IronswornItem['toObject']> &
		Extract<ConfiguredSource<'Item'>, { type: T }>
	export type ActorSource<
		T extends DocumentSubTypes<'Actor'> = DocumentSubTypes<'Actor'>
	> = ReturnType<IronswornActor['toObject']> &
		Extract<ConfiguredSource<'Actor'>, { type: T }> & {
			items?: ItemSource[]
		}
}

export type SourceData<
	DocumentInstance extends InstanceType<SystemDocument>,
	Subtype extends DocumentInstance['type'] = DocumentInstance['type']
> = ReturnType<DocumentInstance['toObject']> &
	Extract<SourceConfig[DocumentInstance['documentName']], { type: Subtype }>

export type DataSchema<SourceData, ConcreteData = SourceData> = {
	[K in keyof ConcreteData]-?: SelectFieldTypeFor<
		K extends keyof SourceData ? NonNullish<SourceData[K]> : any,
		NonNullish<ConcreteData[K]>
	>
}

type NonNullish<T> = Exclude<T, undefined | null>

type SelectFieldTypeFor<SourceData, ConcreteData> =
	ConcreteData extends foundry.abstract.DataModel.Any
		? foundry.data.fields.EmbeddedDataField<any, ConcreteData, any, any>
		: SourceData extends number
		? foundry.data.fields.NumberField<number, number, any>
		: SourceData extends boolean
		? foundry.data.fields.BooleanField
		: SourceData extends string
		? ConcreteData extends string
			? foundry.data.fields.StringField<string, string, any>
			: ConcreteData extends foundry.abstract.Document<any, any, any>
			? foundry.data.fields.StringField<string, ConcreteData, any>
			: foundry.data.fields.StringField<string, any, any>
		: SourceData extends any[]
		? foundry.data.fields.ArrayField<any, SourceData, any>
		: SourceData extends object
		? foundry.data.fields.SchemaField<SourceData, ConcreteData, any>
		: foundry.data.fields.DataField<SourceData, ConcreteData, any>
